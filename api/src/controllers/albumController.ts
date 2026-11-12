import { Request, Response } from "express";
import { Album, Artist, Song } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

/**
 * Converte o ano de lançamento em número inteiro, ou null se inválido.
 * Usado no create e no update.
 */
function parseYear(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const year = Number(value);
    return Number.isInteger(year) ? year : null;
}

/*
 * ─────────────────────────────────────────────────────────────
 * GET /albums — paginado, opcional ?artistId= e ?genre=
 * ─────────────────────────────────────────────────────────────
 * Lista todos os álbuns com paginação e filtros opcionais.
 * É o endpoint principal do explorar.html no frontend.
 */
export async function listAlbums(req: Request, res: Response): Promise<void> {
    try {
        // 1. Paginação segura
        const { page, limit, offset } = parsePagination(req.query);

        // 2. Monta os filtros conforme enviados na query
        const genre = optionalString(req.query.genre);
        const artistIdRaw = req.query.artistId;
        const where: Record<string, unknown> = {};

        if (genre) where.genre = genre;

        if (artistIdRaw !== undefined) {
            const artistId = Number(artistIdRaw);
            if (!Number.isInteger(artistId)) {
                res.status(400).json({ error: "artistId inválido." });
                return;
            }
            where.artistId = artistId;
        }

        // 3. Consulta com include do artista
        const { count, rows } = await Album.findAndCountAll({
            where,
            limit,
            offset,
            order: [["title", "ASC"]],
            include: [{ model: Artist, as: "artist" }],
        });

        // 4. Resposta padrão
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
 * GET /albums/:id — detalhe com artista e faixas
 * ─────────────────────────────────────────────────────────────
 * Retorna um álbum com o artista e todas as músicas.
 * Usado na página de detalhe do álbum.
 */
export async function getAlbum(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const album = await Album.findByPk(id, {
            include: [
                { model: Artist, as: "artist" },   // artista do álbum
                { model: Song, as: "songs" },      // faixas do álbum
            ],
        });

        if (!album) {
            res.status(404).json({ error: "Álbum não encontrado." });
            return;
        }

        res.status(200).json({ data: album });
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * POST /albums
 * ─────────────────────────────────────────────────────────────
 * Cria um álbum. Título e artistId são obrigatórios.
 * Valida se o artista existe antes de criar.
 */
export async function createAlbum(req: Request, res: Response): Promise<void> {
    try {
        // 1. Valida title
        const title = optionalString(req.body?.title);
        if (!title) {
            res.status(400).json({ error: "O campo 'title' é obrigatório." });
            return;
        }

        // 2. Valida artistId
        const artistId = Number(req.body?.artistId);
        if (!Number.isInteger(artistId) || artistId <= 0) {
            res
                .status(400)
                .json({ error: "O campo 'artistId' é obrigatório e deve ser inteiro." });
            return;
        }

        // 3. Confirma que o artista existe no banco
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            res.status(404).json({ error: "Artista informado não existe." });
            return;
        }

        // 4. Cria o álbum
        const album = await Album.create({
            title,
            artistId,
            releaseYear: parseYear(req.body?.releaseYear),
            genre: optionalString(req.body?.genre),
            coverUrl: optionalString(req.body?.coverUrl),
        });

        res.status(201).json({ data: album });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * PUT /albums/:id
 * ─────────────────────────────────────────────────────────────
 * Atualiza apenas os campos enviados no body.
 *
 * IMPORTANTE: usa set() + changed(campo, true) para garantir
 * que o UPDATE sempre execute no banco.
 * ─────────────────────────────────────────────────────────────
 */
export async function updateAlbum(req: Request, res: Response): Promise<void> {
    try {
        // 1. Valida o :id
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        // 2. Confirma que o álbum existe
        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Álbum não encontrado." });
            return;
        }

        // 3. Atualiza os campos enviados
        if (req.body?.title !== undefined) {
            const title = optionalString(req.body.title);
            if (!title) {
                res.status(400).json({ error: "'title' não pode ser vazio." });
                return;
            }
            album.set("title", title);
            album.changed("title", true);
        }

        // CORRIGIDO: set() + changed() em vez de atribuição direta
        if (req.body?.releaseYear !== undefined) {
            album.set("releaseYear", parseYear(req.body.releaseYear));
            album.changed("releaseYear", true);
        }

        // CORRIGIDO: chaves { } para que changed() fique DENTRO do if
        if (req.body?.genre !== undefined) {
            album.set("genre", optionalString(req.body.genre));
            album.changed("genre", true);
        }
        if (req.body?.coverUrl !== undefined) {
            album.set("coverUrl", optionalString(req.body.coverUrl));
            album.changed("coverUrl", true);
        }

        // 4. Troca de artista (opcional): valida se existe
        if (req.body?.artistId !== undefined) {
            const artistId = Number(req.body.artistId);
            if (!Number.isInteger(artistId) || artistId <= 0) {
                res.status(400).json({ error: "artistId inválido." });
                return;
            }

            const artist = await Artist.findByPk(artistId);
            if (!artist) {
                res.status(404).json({ error: "Artista informado não existe." });
                return;
            }

            album.set("artistId", artistId);
            album.changed("artistId", true);
        }

        // 5. Salva e recarrega do banco
        await album.save();
        await album.reload();

        res.status(200).json({ data: album });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * DELETE /albums/:id
 * ─────────────────────────────────────────────────────────────
 * Remove o álbum. As músicas dele são apagadas em cascata.
 */
export async function deleteAlbum(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const album = await Album.findByPk(id);
        if (!album) {
            res.status(404).json({ error: "Álbum não encontrado." });
            return;
        }

        await album.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}