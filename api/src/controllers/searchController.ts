import { Request, Response } from "express";
import { Op } from "sequelize";
import { Artist, Album, Song } from "../models";
import { errorMessage, optionalString } from "../utils/validation";

/*
 * ─────────────────────────────────────────────────────────────
 * GET /search?q=termo&limit=20
 * ─────────────────────────────────────────────────────────────
 * Busca em três tabelas ao mesmo tempo:
 *   - artistas pelo name
 *   - álbuns pelo title
 *   - músicas pelo title
 *
 * Usa ILIKE do PostgreSQL (case-insensitive) via Op.iLike, então
 * "tim maia" encontra "Tim Maia".
 *
 * Devolve os três grupos separados para o frontend montar
 * containers diferentes (busca.html).
 * ─────────────────────────────────────────────────────────────
 */
export async function search(req: Request, res: Response): Promise<void> {
    try {
        // 1. Lê o termo e exige mínimo de 2 caracteres
        const term = optionalString(req.query.q);
        if (!term || term.length < 2) {
            res.status(400).json({
                error: "Informe o parâmetro 'q' com pelo menos 2 caracteres.",
            });
            return;
        }

        // 2. Lê o limite, com teto de 50
        const limitRaw = Number(req.query.limit);
        let limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 20;
        if (limit > 50) limit = 50;

        // 3. Monta o padrão de busca "%termo%" para o ILIKE
        const like = { [Op.iLike]: `%${term}%` };

        // 4. Roda as três consultas em paralelo (mais rápido)
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

        // 5. Soma o total encontrado nos três grupos
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