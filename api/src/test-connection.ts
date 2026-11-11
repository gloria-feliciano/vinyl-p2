import { sequelize } from "./config/database";

async function testarConexao() {
    try {
        await sequelize.authenticate();
        console.log("Conexão com PostgreSQL realizada com sucesso!");
    } catch (error) {
        console.log("Erro ao conextar com PostgressSQL:", error);
    } finally {
        await sequelize.close();
    }
}

testarConexao();