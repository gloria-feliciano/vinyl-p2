# Vinyl API

Backend do projeto Vinyl, desenvolvido com TypeScript, Node.js, Express, Sequelize e PostgreSQL.

## Tecnologias

- Node.js 24
- TypeScript
- Express 5
- Sequelize 6
- PostgreSQL 16
- Docker
- Docker Compose

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

- [Node.js](https://nodejs.org/)
- npm (instalado junto com Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Configuração do ambiente

1. Entre na pasta `api`.
2. Instale as dependências:

```bash
npm install
```

3. Crie seu arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

4. Abra o `.env` e configure sua senha local do PostgreSQL.

Exemplo de configuração:

```env
POSTGRES_DB=vinyl_db
POSTGRES_USER=vinyl
POSTGRES_PASSWORD=sua_senha_local
DB_HOST=localhost
```

**Importante:** o arquivo `.env` contém configurações locais e não deve ser enviado ao GitHub. Cada integrante deve criar seu próprio arquivo.

## Executar com Docker

Com o Docker Desktop aberto e o terminal dentro da pasta `api`, execute:

```bash
docker compose up --build -d
```

Esse comando constrói a imagem da API e inicia os serviços:

- API Vinyl
- PostgreSQL

O Docker Compose configura a comunicação entre os containers automaticamente.

### Verificar os containers

```bash
docker compose ps
```

### Consultar os logs da API

```bash
docker compose logs api
```

### Testar a API

Com os serviços em execução, acesse:

http://localhost:3000/health

A resposta esperada é:

```json
{
  "status": "ok",
  "message": "API Vinyl funcionando!"
}
```

### Parar os serviços

```bash
docker compose down
```

Esse comando para e remove os containers, mas preserva o volume do PostgreSQL e os dados armazenados.

**Atenção:** não utilize `docker compose down -v` sem necessidade, pois essa opção remove também os volumes.

## Executar em modo de desenvolvimento

Com o PostgreSQL em execução e `DB_HOST=localhost` configurado no `.env`, também é possível iniciar a API diretamente pelo Node.js:

```bash
npm run dev
```

Para compilar o TypeScript:

```bash
npm run build
```

Para executar a versão compilada:

```bash
npm start
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia a API em desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versão compilada |
| `npm run test:db` | Testa a conexão com PostgreSQL |

## Portas utilizadas

| Serviço | Porta |
|---|---:|
| API Vinyl | 3000 |
| PostgreSQL | 5432 |

## Estrutura da API

```text
src/
├── config/
│   └── database.ts
├── controllers/
├── docs/
├── middlewares/
├── models/
├── routes/
├── index.ts
└── test-connection.ts
```



