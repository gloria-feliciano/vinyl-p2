import { sequelize } from "../config/database";
import { Artist } from "./Artist";
import { Album } from "./Album";
import { Song } from "./Song";

/* ------------------------------------------------------------------
 * ASSOCIAÇÕES DO CATÁLOGO MUSICAL
 * ------------------------------------------------------------------
 * Aqui dizemos ao Sequelize como as tabelas se relacionam.
 * Isso permite consultas como Album.findAll({ include: "artist" }).
 *
 * Artist 1:N Album   -> um artista tem vários álbuns
 * Artist 1:N Song    -> um artista tem várias músicas
 * Album  1:N Song    -> um álbum tem várias músicas
 *
 * onDelete: CASCADE -> se o artista for deletado, seus álbuns e
 * músicas são apagados automaticamente no banco.
 * ------------------------------------------------------------------ */

// Um artista tem muitos álbuns (apelido "albums")
Artist.hasMany(Album, {
    foreignKey: "artistId",
    as: "albums",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Cada álbum pertence a um artista (apelido "artist")
Album.belongsTo(Artist, {
    foreignKey: "artistId",
    as: "artist",
});

// Um artista tem muitas músicas
Artist.hasMany(Song, {
    foreignKey: "artistId",
    as: "songs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Cada música pertence a um artista
Song.belongsTo(Artist, {
    foreignKey: "artistId",
    as: "artist",
});

// Um álbum tem muitas músicas
Album.hasMany(Song, {
    foreignKey: "albumId",
    as: "songs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Cada música pertence a um álbum
Song.belongsTo(Album, {
    foreignKey: "albumId",
    as: "album",
});

/**
 * Sincroniza os models com o PostgreSQL, criando as tabelas
 * que ainda não existem.
 *
 * alter: false  -> NÃO reescreve colunas existentes. Protege dados
 *                  e as tabelas criadas por outros integrantes.
 * force: false  -> NUNCA derruba tabelas (jamais perde dados).
 *
 * Chamada no index.ts principal após conectar ao banco.
 */
export async function syncDatabase(): Promise<void> {
    await sequelize.sync({ alter: false, force: false });
    console.log("[sequelize] Tabelas do catálogo sincronizadas.");
}

export { Artist, Album, Song, sequelize };