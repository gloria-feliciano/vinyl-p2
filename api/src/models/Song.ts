import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
 * ─────────────────────────────────────────────────────────────
 * INTERFACES DE TIPAGEM
 * ─────────────────────────────────────────────────────────────
 */
interface SongAttributes {
    id: number;
    title: string;
    durationSeconds: number | null;
    trackNumber: number | null;
    albumId: number;           // FK: aponta para Album.id
    artistId: number;          // FK: aponta para Artist.id
    createdAt?: Date;
    updatedAt?: Date;
}

// No create, só title, albumId e artistId são obrigatórios.
interface SongCreationAttributes
    extends Optional<
        SongAttributes,
        "id" | "durationSeconds" | "trackNumber"
    > {}

/*
 * ─────────────────────────────────────────────────────────────
 * CLASSE SONG
 * ─────────────────────────────────────────────────────────────
 */
class Song
    extends Model<SongAttributes, SongCreationAttributes>
    implements SongAttributes {
    public id!: number;
    public title!: string;
    public durationSeconds!: number | null;
    public trackNumber!: number | null;
    public albumId!: number;
    public artistId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/*
 * ─────────────────────────────────────────────────────────────
 * DEFINIÇÃO DAS COLUNAS
 * ─────────────────────────────────────────────────────────────
 */
Song.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // título da música, obrigatório
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O título da música é obrigatório." },
            },
        },

        // duração em segundos, entre 1 e 7200 (2 horas)
        durationSeconds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1], msg: "Duração deve ser maior que zero." },
                max: {
                    args: [7200],
                    msg: "Duração inválida (máximo 7200 segundos).",
                },
            },
        },

        // número da faixa dentro do álbum (1, 2, 3...)
        trackNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1], msg: "Número da faixa deve ser >= 1." },
            },
        },

        // FK obrigatória para o álbum
        albumId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "albums",
                key: "id",
            },
        },

        // FK obrigatória para o artista
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
        tableName: "songs",
        timestamps: true,
        // índices para acelerar filtros
        indexes: [
            { fields: ["albumId"] },
            { fields: ["artistId"] },
            { fields: ["title"] },
        ],
    }
);

export default Song;
export { Song };
export type { SongAttributes, SongCreationAttributes };