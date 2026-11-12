import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
 * ─────────────────────────────────────────────────────────────
 * INTERFACES DE TIPAGEM
 * ─────────────────────────────────────────────────────────────
 */
interface AlbumAttributes {
    id: number;
    title: string;
    releaseYear: number | null;
    genre: string | null;
    coverUrl: string | null;
    artistId: number;          // chave estrangeira: aponta para Artist.id
    createdAt?: Date;
    updatedAt?: Date;
}

// No create, só title e artistId são obrigatórios.
// id, releaseYear, genre e coverUrl são opcionais.
interface AlbumCreationAttributes
    extends Optional<
        AlbumAttributes,
        "id" | "releaseYear" | "genre" | "coverUrl"
    > {}

/*
 * ─────────────────────────────────────────────────────────────
 * CLASSE ALBUM
 * ─────────────────────────────────────────────────────────────
 */
class Album
    extends Model<AlbumAttributes, AlbumCreationAttributes>
    implements AlbumAttributes {
    public id!: number;
    public title!: string;
    public releaseYear!: number | null;
    public genre!: string | null;
    public coverUrl!: string | null;
    public artistId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/*
 * ─────────────────────────────────────────────────────────────
 * DEFINIÇÃO DAS COLUNAS
 * ─────────────────────────────────────────────────────────────
 */
Album.init(
    {
        // id automático
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // title: obrigatório, até 200 caracteres
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O título do álbum é obrigatório." },
                len: {
                    args: [1, 200],
                    msg: "O título deve ter no máximo 200 caracteres.",
                },
            },
        },

        // releaseYear: ano de lançamento, entre 1900 e 2100
        releaseYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1900], msg: "Ano inválido (mínimo 1900)." },
                max: { args: [2100], msg: "Ano inválido (máximo 2100)." },
            },
        },

        // genre: opcional
        genre: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },

        // coverUrl: link da capa, opcional mas válido se enviado
        coverUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: { msg: "coverUrl deve ser uma URL válida." },
            },
        },

        // artistId: OBRIGATÓRIO e aponta para artists.id
        // references garante a chave estrangeira no banco
        artistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "artists",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "albums",
        timestamps: true,
        // índices aceleram buscas e filtros por artista e título
        indexes: [{ fields: ["artistId"] }, { fields: ["title"] }],
    }
);

export default Album;
export { Album };
export type { AlbumAttributes, AlbumCreationAttributes };