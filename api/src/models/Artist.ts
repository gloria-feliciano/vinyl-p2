import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Atributos que o Sequelize gerencia sozinho
interface ArtistAttributes {
    id: number;
    name: string;
    genre: string | null;
    bio: string | null;
    imageUrl: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Atributos exigidos no create (id/timestamps são automáticos)
interface ArtistCreationAttributes
    extends Optional<ArtistAttributes, "id" | "genre" | "bio" | "imageUrl"> {}

class Artist
    extends Model<ArtistAttributes, ArtistCreationAttributes>
    implements ArtistAttributes {
    public id!: number;
    public name!: string;
    public genre!: string | null;
    public bio!: string | null;
    public imageUrl!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Artist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "O nome do artista é obrigatório." },
                len: {
                    args: [2, 150],
                    msg: "O nome do artista deve ter entre 2 e 150 caracteres.",
                },
            },
        },
        genre: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: { msg: "imageUrl deve ser uma URL válida." },
            },
        },
    },
    {
        sequelize,
        tableName: "artists",
        timestamps: true,
    }
);

export default Artist;
export { Artist };
export type { ArtistAttributes, ArtistCreationAttributes };