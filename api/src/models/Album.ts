import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface AlbumAttributes {
    id: number;
    title: string;
    releaseYear: number | null;
    genre: string | null;
    coverUrl: string | null;
    artistId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AlbumCreationAttributes
    extends Optional<
        AlbumAttributes,
        "id" | "releaseYear" | "genre" | "coverUrl"
    > {}

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

Album.init(
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
                notEmpty: { msg: "O título do álbum é obrigatório." },
                len: {
                    args: [1, 200],
                    msg: "O título deve ter no máximo 200 caracteres.",
                },
            },
        },
        releaseYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1900], msg: "Ano inválido (mínimo 1900)." },
                max: { args: [2100], msg: "Ano inválido (máximo 2100)." },
            },
        },
        genre: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        coverUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: { msg: "coverUrl deve ser uma URL válida." },
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
        tableName: "albums",
        timestamps: true,
        indexes: [{ fields: ["artistId"] }, { fields: ["title"] }],
    }
);

export default Album;
export { Album };
export type { AlbumAttributes, AlbumCreationAttributes };