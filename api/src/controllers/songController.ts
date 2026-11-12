import { Request, Response } from "express";
import { Song, Album, Artist } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

function parseIntOrNull(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
}

/** GET /songs — paginado, opcional ?albumId= e ?artistId= */
export async function listSongs(req: Request, res: Response): Promise<void> {
    try {
        const { page, limit, offset } = parsePagination(req.query);

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

/** GET /songs/:id */
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

/** POST /songs */
export async function createSong(req: Request, res: Response): Promise<void> {
    try {
        const title = optionalString(req.body?.title);
        if (!title) {
            res.status(400).json({ error: "O campo title e obrigatorio." });
            return;
        }

        const albumId = Number(req.body?.albumId);
        if (!Number.isInteger(albumId) || albumId <= 0) {
            res.status(400).json({ error: "O campo albumId e obrigatorio." });
            return;
        }

        const album = await Album.findByPk(albumId);
        if (!album) {
            res.status(404).json({ error: "Album informado nao existe." });
            return;
        }

        // artistId: usa o do body se valido, senao herda do album.
        // album.artistId ja e number no model, nao precisa de cast.
        let artistId: number;
        const fromBody = parseIntOrNull(req.body?.artistId);

        if (fromBody !== null) {
            const artist = await Artist.findByPk(fromBody);
            if (!artist) {
                res.status(404).json({ error: "Artista informado nao existe." });
                return;
            }
            artistId = fromBody;
        } else {
            // getDataValue lê direto do dataValues do Sequelize,
            // evitando o getter tipado que pode vir undefined.
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

export async function updateSong(req: Request, res: Response): Promise<void> {
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
            song.albumId = albumId;
        }

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
            song.artistId = artistId;
        }

        await song.save();
        await song.reload();
        res.status(200).json({ data: song });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/** DELETE /songs/:id */
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