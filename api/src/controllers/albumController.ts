import { Request, Response } from "express";
import { Album, Artist, Song } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

function parseYear(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const year = Number(value);
    return Number.isInteger(year) ? year : null;
}

/** GET /albums — paginado, opcional ?artistId= e ?genre= */
export async function listAlbums(req: Request, res: Response): Promise<void> {
    try {
        const { page, limit, offset } = parsePagination(req.query);
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

        const { count, rows } = await Album.findAndCountAll({
            where,
            limit,
            offset,
            order: [["title", "ASC"]],
            include: [{ model: Artist, as: "artist" }],
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

/** GET /albums/:id — detalhe com artista e faixas */
export async function getAlbum(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

        const album = await Album.findByPk(id, {
            include: [
                { model: Artist, as: "artist" },
                { model: Song, as: "songs" },
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

/** POST /albums */
export async function createAlbum(req: Request, res: Response): Promise<void> {
    try {
        const title = optionalString(req.body?.title);
        if (!title) {
            res.status(400).json({ error: "O campo 'title' é obrigatório." });
            return;
        }

        const artistId = Number(req.body?.artistId);
        if (!Number.isInteger(artistId) || artistId <= 0) {
            res
                .status(400)
                .json({ error: "O campo 'artistId' é obrigatório e deve ser inteiro." });
            return;
        }

        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            res.status(404).json({ error: "Artista informado não existe." });
            return;
        }

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

/** PUT /albums/:id */
export async function updateAlbum(req: Request, res: Response): Promise<void> {
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

        if (req.body?.title !== undefined) {
            const title = optionalString(req.body.title);
            if (!title) {
                res.status(400).json({ error: "'title' não pode ser vazio." });
                return;
            }
            album.set("title", title);
            album.changed("title", true);
        }
        if (req.body?.releaseYear !== undefined)
            album.releaseYear = parseYear(req.body.releaseYear);
        if (req.body?.genre !== undefined)
            album.set("genre", optionalString(req.body.genre));
            album.changed("genre", true);
        if (req.body?.coverUrl !== undefined)
            album.set("coverUrl", optionalString(req.body.coverUrl));
            album.changed("coverUrl", true);
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

        await album.save();
        await album.reload();
        res.status(200).json({ data: album });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/** DELETE /albums/:id */
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