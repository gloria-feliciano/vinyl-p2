import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize ( 
    process.env.POSTGRES_DB!, 
    process.env.POSTGRES_USER!, 
    process.env.POSTGRES_PASSWORD!, 
    {
        host: process.env.DB_HOST, 
        port: 5432,
        dialect: "postgres",
        logging: false,
    }
);