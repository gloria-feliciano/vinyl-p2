import express from "express";
import { sequelize } from "./config/database";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API Vinyl funcionando!"
    });
});

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("|Conexão com PostgreSQL realizada com suceso!");

        app.listen(PORT, () => {
            console.log(`API Vinyl rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao iniciar a API:", error);
        process.exit(1);
    }
}

iniciarServidor();