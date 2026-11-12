import { sequelize } from "../config/database";
import { Artist } from "./Artist";
import { Album } from "./Album";
import { Song } from "./Song";

/* ------------------------------------------------------------------
 * ASSOCIAÇÕES DO CATÁLOGO MUSICAL
 * ------------------------------------------------------------------
 * Artist 1:N Album
 * Artist 1:N Song
 * Album  1:N Song
 *
 * Ao adicionar models de outras frentes (Review, Rating, Favorite),
 * registre as associações aqui também, neste mesmo bloco.
 * ------------------------------------------------------------------ */

Artist.hasMany(Album, {
    foreignKey: "artistId",
    as: "albums",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Album.belongsTo(Artist, {
    foreignKey: "artistId",
    as: "artist",
});

Artist.hasMany(Song, {
    foreignKey: "artistId",
    as: "songs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Song.belongsTo(Artist, {
    foreignKey: "artistId",
    as: "artist",
});

Album.hasMany(Song, {
    foreignKey: "albumId",
    as: "songs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Song.belongsTo(Album, {
    foreignKey: "albumId",
    as: "album",
});

/**
 * Sincroniza os models com o PostgreSQL.
 * alter: false  -> não reescreve colunas existentes (protege dados
 *                  e tabelas de outros integrantes)
 * force: false  -> nunca derruba tabelas
 */
export async function syncDatabase(): Promise<void> {
    await sequelize.sync({ alter: false, force: false });
    console.log("[sequelize] Tabelas do catálogo sincronizadas.");
}

export { Artist, Album, Song, sequelize };