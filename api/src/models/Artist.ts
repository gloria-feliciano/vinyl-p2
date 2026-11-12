import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
 * ─────────────────────────────────────────────────────────────
 * INTERFACES DE TIPAGEM
 * ─────────────────────────────────────────────────────────────
 * "ArtistAttributes" descreve TODAS as colunas que existem no banco.
 * "ArtistCreationAttributes" descreve quais são OBRIGATÓRIAS no momento
 * do create() — o resto é opcional porque o banco preenche sozinho.
 */

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

/*
 * ─────────────────────────────────────────────────────────────
 * CLASSE ARTIST
 * ─────────────────────────────────────────────────────────────
 * Esta classe representa a tabela "artists". Cada instância dela
 * é uma linha da tabela. As propriedades públicas (public ...)
 * são os campos acessíveis no código TypeScript.
 */
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

/*
 * ─────────────────────────────────────────────────────────────
 * DEFINIÇÃO DAS COLUNAS (Artist.init)
 * ─────────────────────────────────────────────────────────────
 * Aqui dizemos ao Sequelize como criar a tabela no PostgreSQL.
 * Cada campo tem: tipo, se aceita nulo e regras de validação.
 */
Artist.init(
    {
        // id: chave primária, incrementa sozinho (1, 2, 3...)
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // name: obrigatório, único no banco, entre 2 e 150 caracteres
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

        // genre: opcional (ex: "MPB", "Rock", "Soul")
        genre: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },

        // bio: opcional, texto longo (TEXT não tem limite curto)
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // imageUrl: opcional, mas se enviada precisa ser uma URL válida
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: { msg: "imageUrl deve ser uma URL válida." },
            },
        },
    },
    {
        sequelize,              // conexão que será usada
        tableName: "artists",   // nome exato da tabela no PostgreSQL
        timestamps: true,       // cria createdAt e updatedAt automaticamente
    }
);

export default Artist;
export { Artist };
export type { ArtistAttributes, ArtistCreationAttributes };