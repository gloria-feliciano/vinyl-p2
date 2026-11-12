import { Request, Response } from "express";
import { Artist, Album, Song } from "../models";
import {
    parseId,
    parsePagination,
    errorMessage,
    optionalString,
} from "../utils/validation";

/** GET /artists — lista paginada, opcionalmente filtrada por ?genre= */
export async function listArtists(req: Request, res: Response): Promise<void> {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const genre = optionalString(req.query.genre);

        const where: Record<string, unknown> = {};
        if (genre) where.genre = genre;

        const { count, rows } = await Artist.findAndCountAll({
            where,
            limit,
            offset,
            order: [["name", "ASC"]],
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

/** GET /artists/:id — detalhe com álbuns e músicas */
export async function getArtist(req: Request, res: Response): Promise<void> {
    try {
        const id = parseId(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }

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

/** POST /artists — cria artista */
export async function createArtist(req: Request, res: Response): Promise<void> {
    try {
        const name = optionalString(req.body?.name);
        if (!name) {
            res.status(400).json({ error: "O campo 'name' é obrigatório." });
            return;
        }

        const artist = await Artist.create({
            name,
            genre: optionalString(req.body?.genre),
            bio: optionalString(req.body?.bio),
            imageUrl: optionalString(req.body?.imageUrl),
        });

        res.status(201).json({ data: artist });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/** PUT /artists/:id — atualiza */
export async function updateArtist(req: Request, res: Response): Promise<void> {
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
        if (req.body?.genre !== undefined)
            artist.set("genre", optionalString(req.body.genre));
            artist.changed("genre", true);
        if (req.body?.bio !== undefined)
            artist.set("bio", optionalString(req.body.bio));
            artist.changed("bio", true);
        if (req.body?.imageUrl !== undefined)
            artist.set("imageUrl", optionalString(req.body.imageUrl));
            artist.changed("imageUrl", true);

        await artist.save();
        await artist.reload();
        res.status(200).json({ data: artist });
    } catch (error) {
        res.status(400).json({ error: errorMessage(error) });
    }
}

/** DELETE /artists/:id — remove (cascateia álbuns e músicas) */
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
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}