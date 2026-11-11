# Vinyl

Projeto Vinyl: plataforma musical com frontend em HTML, CSS e JavaScript e backend desenvolvido em TypeScript.

## Tecnologias

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend
- Node.js
- TypeScript
- Express
- Sequelize
- PostgreSQL
- Docker e Docker Compose

## Estrutura do projeto

```text
vinyl-p2/
├── frontend/
│   ├── páginas, estilos e scripts
│   └── ...
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── README.md
└── README.md
```

## Executar o projeto

### Frontend

É possível executar o frontend com um servidor HTTP estático. Utilizando Python:

```bash
python -m http.server 5500 --directory frontend
```

Acesse: http://localhost:5500

### Backend e banco de dados

Consulte as instruções de instalação e execução em [`api/README.md`](api/README.md).

A API utiliza Docker Compose para executar o servidor e o PostgreSQL.

## Documentação

A documentação da API e as instruções para configurar o ambiente estão disponíveis em `api/README.md`.

## Desenvolvimento

O projeto utiliza branches de funcionalidades (`feature/*`) e Pull Requests para integrar alterações à branch `dev`. A branch `main` é reservada para versões estáveis.

