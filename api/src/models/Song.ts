import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface SongAttributes {
    id: number;
    title: string;
    durationSeconds: number | null;
    trackNumber: number | null;
    albumId: number;
    artistId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface SongCreationAttributes
    extends Optional<
        SongAttributes,
        "id" | "durationSeconds" | "trackNumber"
    > {}

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

Song.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O título da música é obrigatório." },
            },
        },
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
        trackNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1], msg: "Número da faixa deve ser >= 1." },
            },
        },
        albumId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "albums",
                key: "id",
            },
        },
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