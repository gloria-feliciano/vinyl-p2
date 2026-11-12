import { Request, Response } from "express";
import { Artist, Album, Song } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

/*
 * ─────────────────────────────────────────────────────────────
 * GET /artists — lista paginada, opcionalmente filtrada por ?genre=
 * ─────────────────────────────────────────────────────────────
 * Devolve todos os artistas com paginação.
 * O frontend pode filtrar por gênero com ?genre=MPB.
 */
export async function listArtists(req: Request, res: Response): Promise<void> {
    try {
        // 1. Lê paginação com valores seguros
        const { page, limit, offset } = parsePagination(req.query);

        // 2. Lê filtro opcional de gênero
        const genre = optionalString(req.query.genre);
        const where: Record<string, unknown> = {};
        if (genre) where.genre = genre;

        // 3. Consulta o banco e devolve total + dados da página atual
        const { count, rows } = await Artist.findAndCountAll({
            where,
            limit,
            offset,
            order: [["name", "ASC"]],   // ordem alfabética
        });

        // 4. Resposta no formato padrão do projeto: { data, meta }
        res.status(200).json({
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * GET /artists/:id — detalhe com álbuns e músicas
 * ─────────────────────────────────────────────────────────────
 * Retorna um artista com todos os seus álbuns e músicas aninhados.
 * É o endpoint usado na página de perfil do artista no frontend.
 */
export async function getArtist(req: Request, res: Response): Promise<void> {
    try {
        // Converte o :id da URL em número
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        // Busca o artista trazendo junto seus álbuns e músicas
        // (include usa os apelidos definidos em models/index.ts)
        const artist = await Artist.findByPk(id, {
            include: [
                { model: Album, as: "albums" },
                { model: Song, as: "songs" },
            ],
        });

        if (!artist) {
            res.status(404).json({ error: "Artista não encontrado." });
            return;
        }

        res.status(200).json({ data: artist });
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * POST /artists — cria artista
 * ─────────────────────────────────────────────────────────────
 * Recebe { name, genre?, bio?, imageUrl? } no body.
 * name é o único obrigatório.
 */
export async function createArtist(req: Request, res: Response): Promise<void> {
    try {
        // Validação: name é obrigatório
        const name = optionalString(req.body?.name);
        if (!name) {
            res.status(400).json({ error: "O campo 'name' é obrigatório." });
            return;
        }

        // Cria o artista — os campos opcionais ficam null se não vierem
        const artist = await Artist.create({
            name,
            genre: optionalString(req.body?.genre),
            bio: optionalString(req.body?.bio),
            imageUrl: optionalString(req.body?.imageUrl),
        });

        // 201 = criado com sucesso
        res.status(201).json({ data: artist });
    } catch (error) {
        // 400 se o Sequelize rejeitar (ex: nome duplicado, URL inválida)
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * PUT /artists/:id — atualiza
 * ─────────────────────────────────────────────────────────────
 * Recebe apenas os campos que devem ser alterados.
 *
 * IMPORTANTE: usa set() + changed(campo, true) para garantir
 * que o Sequelize sempre gere o UPDATE. Atribuição direta
 * (artist.name = x) pode não persistir — é um bug silencioso
 * conhecido do Sequelize.
 * ─────────────────────────────────────────────────────────────
 */
export async function updateArtist(req: Request, res: Response): Promise<void> {
    try {
        // 1. Valida o :id
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        // 2. Confirma que o artista existe
        const artist = await Artist.findByPk(id);
        if (!artist) {
            res.status(404).json({ error: "Artista não encontrado." });
            return;
        }

        // 3. Atualiza apenas os campos enviados
        if (req.body?.name !== undefined) {
            const name = optionalString(req.body.name);
            if (!name) {
                res
                    .status(400)
                    .json({ error: "'name' não pode ser vazio." });
                return;
            }
            artist.set("name", name);
            artist.changed("name", true);
        }

        // CORRIGIDO: chaves { } para que changed() fique DENTRO do if
        if (req.body?.genre !== undefined) {
            artist.set("genre", optionalString(req.body.genre));
            artist.changed("genre", true);
        }
        if (req.body?.bio !== undefined) {
            artist.set("bio", optionalString(req.body.bio));
            artist.changed("bio", true);
        }
        if (req.body?.imageUrl !== undefined) {
            artist.set("imageUrl", optionalString(req.body.imageUrl));
            artist.changed("imageUrl", true);
        }

        // 4. Salva e recarrega do banco para devolver o valor real
        await artist.save();
        await artist.reload();

        res.status(200).json({ data: artist });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * DELETE /artists/:id — remove (cascateia álbuns e músicas)
 * ─────────────────────────────────────────────────────────────
 * Ao deletar o artista, o banco apaga automaticamente seus
 * álbuns e músicas por causa do onDelete: CASCADE.
 */
export async function deleteArtist(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const artist = await Artist.findByPk(id);
        if (!artist) {
            res.status(404).json({ error: "Artista não encontrado." });
            return;
        }

        await artist.destroy();

        // 204 = sucesso sem corpo de resposta
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}