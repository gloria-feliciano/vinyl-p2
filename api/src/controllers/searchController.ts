import { Request, Response } from "express";
import { Op } from "sequelize";
import { Artist, Album, Song } from "../models";
import { errorMessage, optionalString } from "../utils/validation";

/**
 * GET /search?q=termo&limit=20
 *
 * Busca em paralelo em artistas, álbuns e músicas usando ILIKE
 * (case-insensitive, nativo do PostgreSQL via Op.iLike).
 * Retorna os três grupos separados para o frontend renderizar
 * containers diferentes (#resultado-explorar, #resultados).
 */
export async function search(req: Request, res: Response): Promise<void> {
    try {
        const term = optionalString(req.query.q);

        if (!term || term.length < 2) {
            res.status(400).json({
                error: "Informe o parâmetro 'q' com pelo menos 2 caracteres.",
            });
            return;
        }

        const limitRaw = Number(req.query.limit);
        let limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 20;
        if (limit > 50) limit = 50;

        const like = { [Op.iLike]: `%${term}%` };

        const [artists, albums, songs] = await Promise.all([
            Artist.findAll({
                where: { name: like },
                limit,
                order: [["name", "ASC"]],
            }),
            Album.findAll({
                where: { title: like },
                limit,
                order: [["title", "ASC"]],
                include: [{ model: Artist, as: "artist" }],
            }),
            Song.findAll({
                where: { title: like },
                limit,
                order: [["title", "ASC"]],
                include: [
                    { model: Album, as: "album" },
                    { model: Artist, as: "artist" },
                ],
            }),
        ]);

        const total = artists.length + albums.length + songs.length;

        res.status(200).json({
            query: term,
            total,
            data: { artists, albums, songs },
        });
    } catch (error) {
        res.status(500).json({ error: errorMessage(error) });
    }
}