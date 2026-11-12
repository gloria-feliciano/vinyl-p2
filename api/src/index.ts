import express from "express";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./config/database";
import { syncDatabase } from "./models";                 // ← ADICIONADO
import apiRoutes from "./routes";                        // ← ADICIONADO
import { swaggerSpec } from "./docs/swagger";            // ← ADICIONADO

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API Vinyl funcionando!"
    });
});

// ← ADICIONADO: rotas do catálogo sob /api
app.use("/api", apiRoutes);

// ← ADICIONADO: documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("|Conexão com PostgreSQL realizada com sucesso!");

        // ← ADICIONADO: cria/atualiza as tabelas do catálogo
        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`API Vinyl rodando na porta ${PORT}`);
            console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Erro ao iniciar a API:", error);
        process.exit(1);
    }
}

iniciarServidor();