import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Vinyl API — Catálogo Musical",
            version: "1.0.0",
            description:
                "API do projeto Vinyl. Módulo de Catálogo Musical (Integrante 2): " +
                "Artistas, Álbuns, Músicas e Busca global.",
        },
        servers: [
            { url: "http://localhost:3000/api", description: "Local" },
            { url: "http://localhost:3000", description: "Local (raiz)" },
        ],
        tags: [
            { name: "Artists", description: "Gestão de artistas" },
            { name: "Albums", description: "Gestão de álbuns" },
            { name: "Songs", description: "Gestão de músicas" },
            { name: "Search", description: "Busca global" },
        ],
        components: {
            schemas: {
                Artist: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Tim Maia" },
                        genre: { type: "string", example: "MPB" },
                        bio: { type: "string", nullable: true },
                        imageUrl: {
                            type: "string",
                            nullable: true,
                            example: "https://exemplo.com/tim.jpg",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ArtistInput: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "Tim Maia" },
                        genre: { type: "string", example: "MPB" },
                        bio: { type: "string" },
                        imageUrl: { type: "string" },
                    },
                },
                Album: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        title: {
                            type: "string",
                            example: "Racional Vol. 1",
                        },
                        releaseYear: { type: "integer", example: 1975 },
                        genre: { type: "string", example: "MPB" },
                        coverUrl: { type: "string", nullable: true },
                        artistId: { type: "integer", example: 1 },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AlbumInput: {
                    type: "object",
                    required: ["title", "artistId"],
                    properties: {
                        title: {
                            type: "string",
                            example: "Racional Vol. 1",
                        },
                        releaseYear: { type: "integer", example: 1975 },
                        genre: { type: "string", example: "MPB" },
                        coverUrl: { type: "string" },
                        artistId: { type: "integer", example: 1 },
                    },
                },
                Song: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "string", example: "Bom Senso" },
                        durationSeconds: { type: "integer", example: 245 },
                        trackNumber: { type: "integer", example: 1 },
                        albumId: { type: "integer", example: 1 },
                        artistId: { type: "integer", example: 1 },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                SongInput: {
                    type: "object",
                    required: ["title", "albumId"],
                    properties: {
                        title: { type: "string", example: "Bom Senso" },
                        durationSeconds: { type: "integer", example: 245 },
                        trackNumber: { type: "integer", example: 1 },
                        albumId: { type: "integer", example: 1 },
                        artistId: {
                            type: "integer",
                            example: 1,
                            description:
                                "Opcional. Se omitido, herda o artista do álbum.",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Artista não encontrado.",
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 42 },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 20 },
                        totalPages: { type: "integer", example: 3 },
                    },
                },
            },
        },
        paths: {
            /* ---------------- ARTISTS ---------------- */
            "/artists": {
                get: {
                    tags: ["Artists"],
                    summary: "Lista artistas (paginado)",
                    parameters: [
                        { in: "query", name: "page", schema: { type: "integer", default: 1 } },
                        { in: "query", name: "limit", schema: { type: "integer", default: 20 } },
                        { in: "query", name: "genre", schema: { type: "string" } },
                    ],
                    responses: {
                        "200": {
                            description: "Lista retornada",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Artist" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ["Artists"],
                    summary: "Cria um artista",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ArtistInput" },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "Criado" },
                        "400": {
                            description: "Dados inválidos",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Error" },
                                },
                            },
                        },
                    },
                },
            },
            "/artists/{id}": {
                get: {
                    tags: ["Artists"],
                    summary: "Detalhe do artista (com álbuns e músicas)",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: {
                        "200": { description: "Encontrado" },
                        "404": { description: "Não encontrado" },
                    },
                },
                put: {
                    tags: ["Artists"],
                    summary: "Atualiza um artista",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ArtistInput" },
                            },
                        },
                    },
                    responses: {
                        "200": { description: "Atualizado" },
                        "404": { description: "Não encontrado" },
                    },
                },
                delete: {
                    tags: ["Artists"],
                    summary: "Remove um artista (cascateia álbuns e músicas)",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: {
                        "204": { description: "Removido" },
                        "404": { description: "Não encontrado" },
                    },
                },
            },
            /* ---------------- ALBUMS ---------------- */
            "/albums": {
                get: {
                    tags: ["Albums"],
                    summary: "Lista álbuns (paginado)",
                    parameters: [
                        { in: "query", name: "page", schema: { type: "integer", default: 1 } },
                        { in: "query", name: "limit", schema: { type: "integer", default: 20 } },
                        { in: "query", name: "artistId", schema: { type: "integer" } },
                        { in: "query", name: "genre", schema: { type: "string" } },
                    ],
                    responses: { "200": { description: "Lista retornada" } },
                },
                post: {
                    tags: ["Albums"],
                    summary: "Cria um álbum",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AlbumInput" },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "Criado" },
                        "404": { description: "Artista não existe" },
                    },
                },
            },
            "/albums/{id}": {
                get: {
                    tags: ["Albums"],
                    summary: "Detalhe do álbum (com artista e faixas)",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: {
                        "200": { description: "Encontrado" },
                        "404": { description: "Não encontrado" },
                    },
                },
                put: {
                    tags: ["Albums"],
                    summary: "Atualiza um álbum",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AlbumInput" },
                            },
                        },
                    },
                    responses: { "200": { description: "Atualizado" } },
                },
                delete: {
                    tags: ["Albums"],
                    summary: "Remove um álbum (cascateia músicas)",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: { "204": { description: "Removido" } },
                },
            },
            /* ---------------- SONGS ---------------- */
            "/songs": {
                get: {
                    tags: ["Songs"],
                    summary: "Lista músicas (paginado)",
                    parameters: [
                        { in: "query", name: "page", schema: { type: "integer", default: 1 } },
                        { in: "query", name: "limit", schema: { type: "integer", default: 20 } },
                        { in: "query", name: "albumId", schema: { type: "integer" } },
                        { in: "query", name: "artistId", schema: { type: "integer" } },
                    ],
                    responses: { "200": { description: "Lista retornada" } },
                },
                post: {
                    tags: ["Songs"],
                    summary: "Cria uma música",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SongInput" },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "Criado" },
                        "404": { description: "Álbum não existe" },
                    },
                },
            },
            "/songs/{id}": {
                get: {
                    tags: ["Songs"],
                    summary: "Detalhe da música",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: {
                        "200": { description: "Encontrado" },
                        "404": { description: "Não encontrado" },
                    },
                },
                put: {
                    tags: ["Songs"],
                    summary: "Atualiza uma música",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SongInput" },
                            },
                        },
                    },
                    responses: { "200": { description: "Atualizado" } },
                },
                delete: {
                    tags: ["Songs"],
                    summary: "Remove uma música",
                    parameters: [
                        { in: "path", name: "id", required: true, schema: { type: "integer" } },
                    ],
                    responses: { "204": { description: "Removido" } },
                },
            },
            /* ---------------- SEARCH ---------------- */
            "/search": {
                get: {
                    tags: ["Search"],
                    summary: "Busca global em artistas, álbuns e músicas",
                    parameters: [
                        {
                            in: "query",
                            name: "q",
                            required: true,
                            schema: { type: "string", minLength: 2 },
                            description: "Termo com no mínimo 2 caracteres",
                        },
                        { in: "query", name: "limit", schema: { type: "integer", default: 20 } },
                    ],
                    responses: {
                        "200": {
                            description: "Resultados agrupados",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            query: { type: "string" },
                                            total: { type: "integer" },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    artists: {
                                                        type: "array",
                                                        items: { $ref: "#/components/schemas/Artist" },
                                                    },
                                                    albums: {
                                                        type: "array",
                                                        items: { $ref: "#/components/schemas/Album" },
                                                    },
                                                    songs: {
                                                        type: "array",
                                                        items: { $ref: "#/components/schemas/Song" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { description: "Termo ausente ou curto demais" },
                    },
                },
            },
        },
    },
    apis: [], // tudo declarado inline; não depende de JSDoc nos arquivos
};

export const swaggerSpec = swaggerJsdoc(options);