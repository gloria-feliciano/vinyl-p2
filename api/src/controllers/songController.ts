import { Request, Response } from "express";
import { Song, Album, Artist } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

/**
 * Converte valor em inteiro, ou null se inválido.
 * Usado para durationSeconds e trackNumber (opcionais).
 */
function parseIntOrNull(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
}

/*
 * ─────────────────────────────────────────────────────────────
 * GET /songs — paginado, opcional ?albumId= e ?artistId=
 * ─────────────────────────────────────────────────────────────
 * Lista músicas com filtros. Usado no app.html e perfil.html.
 */
export async function listSongs(req: Request, res: Response): Promise<void> {
    try {
        // 1. Paginação
        const { page, limit, offset } = parsePagination(req.query);

        // 2. Filtros opcionais
        const where: Record<string, unknown> = {};
        const albumIdRaw = req.query.albumId;
        const artistIdRaw = req.query.artistId;

        if (albumIdRaw !== undefined) {
            const albumId = Number(albumIdRaw);
            if (!Number.isInteger(albumId)) {
                res.status(400).json({ error: "albumId inválido." });
                return;
            }
            where.albumId = albumId;
        }

        if (artistIdRaw !== undefined) {
            const artistId = Number(artistIdRaw);
            if (!Number.isInteger(artistId)) {
                res.status(400).json({ error: "artistId inválido." });
                return;
            }
            where.artistId = artistId;
        }

        // 3. Consulta: ordena por álbum e depois por faixa
        const { count, rows } = await Song.findAndCountAll({
            where,
            limit,
            offset,
            order: [
                ["albumId", "ASC"],
                ["trackNumber", "ASC"],
            ],
            include: [
                { model: Album, as: "album" },
                { model: Artist, as: "artist" },
            ],
        });

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
 * GET /songs/:id
 * ─────────────────────────────────────────────────────────────
 * Retorna uma música com álbum e artista aninhados.
 */
export async function getSong(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const song = await Song.findByPk(id, {
            include: [
                { model: Album, as: "album" },
                { model: Artist, as: "artist" },
            ],
        });

        if (!song) {
            res.status(404).json({ error: "Música não encontrada." });
            return;
        }

        res.status(200).json({ data: song });
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * POST /songs
 * ─────────────────────────────────────────────────────────────
 * Cria uma música. title e albumId são obrigatórios.
 *
 * REGRA ESPECIAL: artistId é OPCIONAL.
 * - Se vier no body, usa.
 * - Se não vier, HERDA o artista do álbum.
 * Isso permite que o frontend só envie o álbum e a música
 * já fica no artista certo.
 * ─────────────────────────────────────────────────────────────
 */
export async function createSong(req: Request, res: Response): Promise<void> {
    try {
        // 1. Valida title
        const title = optionalString(req.body?.title);
        if (!title) {
            res.status(400).json({ error: "O campo title e obrigatorio." });
            return;
        }

        // 2. Valida albumId
        const albumId = Number(req.body?.albumId);
        if (!Number.isInteger(albumId) || albumId <= 0) {
            res.status(400).json({ error: "O campo albumId e obrigatorio." });
            return;
        }

        // 3. Confirma que o álbum existe
        const album = await Album.findByPk(albumId);
        if (!album) {
            res.status(404).json({ error: "Album informado nao existe." });
            return;
        }

        // 4. Resolve o artistId: do body, ou herdado do álbum
        let artistId: number;
        const fromBody = parseIntOrNull(req.body?.artistId);

        if (fromBody !== null) {
            // Veio no body: confirma que existe
            const artist = await Artist.findByPk(fromBody);
            if (!artist) {
                res.status(404).json({ error: "Artista informado nao existe." });
                return;
            }
            artistId = fromBody;
        } else {
            // Não veio: lê direto do dataValues do álbum
            // (getDataValue evita o getter tipado que pode vir undefined)
            const rawValue = album.getDataValue("artistId") as unknown;
            const inherited = Number(rawValue);

            if (!Number.isInteger(inherited) || inherited <= 0) {
                res.status(400).json({
                    error: "Album sem artista vinculado. Envie artistId no body.",
                });
                return;
            }
            artistId = inherited;
        }

        // 5. Cria a música
        const song = await Song.create({
            title,
            albumId,
            artistId,
            durationSeconds: parseIntOrNull(req.body?.durationSeconds),
            trackNumber: parseIntOrNull(req.body?.trackNumber),
        });

        res.status(201).json({ data: song });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * PUT /songs/:id
 * ─────────────────────────────────────────────────────────────
 * Atualiza apenas os campos enviados.
 * Usa set() + changed() + reload() para persistência garantida.
 * ─────────────────────────────────────────────────────────────
 */
export async function updateSong(req: Request, res: Response): Promise<void> {
    try {
        // 1. Valida o :id
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        // 2. Confirma que a música existe
        const song = await Song.findByPk(id);
        if (!song) {
            res.status(404).json({ error: "Música não encontrada." });
            return;
        }

        // 3. Atualiza os campos enviados
        if (req.body?.title !== undefined) {
            const title = optionalString(req.body.title);
            if (!title) {
                res.status(400).json({ error: "'title' não pode ser vazio." });
                return;
            }
            song.set("title", title);
            song.changed("title", true);
        }

        if (req.body?.durationSeconds !== undefined) {
            song.set("durationSeconds", parseIntOrNull(req.body.durationSeconds));
            song.changed("durationSeconds", true);
        }
        if (req.body?.trackNumber !== undefined) {
            song.set("trackNumber", parseIntOrNull(req.body.trackNumber));
            song.changed("trackNumber", true);
        }

        // 4. Troca de álbum (opcional)
        if (req.body?.albumId !== undefined) {
            const albumId = Number(req.body.albumId);
            if (!Number.isInteger(albumId) || albumId <= 0) {
                res.status(400).json({ error: "albumId inválido." });
                return;
            }

            const album = await Album.findByPk(albumId);
            if (!album) {
                res.status(404).json({ error: "Álbum informado não existe." });
                return;
            }

            // CORRIGIDO: set() + changed() em vez de atribuição direta
            song.set("albumId", albumId);
            song.changed("albumId", true);
        }

        // 5. Troca de artista (opcional)
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

            // CORRIGIDO: set() + changed() em vez de atribuição direta
            song.set("artistId", artistId);
            song.changed("artistId", true);
        }

        // 6. Salva e recarrega do banco
        await song.save();
        await song.reload();

        res.status(200).json({ data: song });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/*
 * ─────────────────────────────────────────────────────────────
 * DELETE /songs/:id
 * ─────────────────────────────────────────────────────────────
 */
export async function deleteSong(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const song = await Song.findByPk(id);
        if (!song) {
            res.status(404).json({ error: "Música não encontrada." });
            return;
        }

        await song.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}