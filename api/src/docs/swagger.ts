import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

/*
 * ─────────────────────────────────────────────────────────────
 * CONFIGURAÇÃO DO SWAGGER (documentação interativa da API)
 * ─────────────────────────────────────────────────────────────
 * Este arquivo NÃO contém lógica da API. Ele monta um "mapa" que
 * descreve todos os endpoints para o Swagger UI renderizar a
 * página visual em /api-docs.
 *
 * O objeto "options" tem duas partes:
 * 1. definition  -> a especificação OpenAPI (títulos, schemas, rotas)
 * 2. apis        -> de onde ler anotações JSDoc (aqui: nenhum)
 *
 * Tudo é declarado "inline" (dentro deste arquivo), então não
 * dependemos de comentários espalhados nos controllers.
 * ─────────────────────────────────────────────────────────────
 */
const options: Options = {
    definition: {
        /*
         * Versão do padrão OpenAPI usada.
         * 3.0.3 é o formato aceito pelo Swagger UI 5.x.
         */
        openapi: "3.0.3",

        /*
         * INFORMAÇÕES GERAIS que aparecem no topo da página /api-docs.
         */
        info: {
            title: "Vinyl API — Catálogo Musical",
            version: "1.0.0",
            description:
                "API do projeto Vinyl. Módulo de Catálogo Musical (Integrante 2): " +
                "Artistas, Álbuns, Músicas e Busca global.",
        },

        /*
         * SERVIDORES onde a API está rodando.
         * O Swagger UI mostra um dropdown para o usuário escolher
         * contra qual servidor enviar as requisições de teste.
         *
         * - O primeiro usa /api como prefixo (ex: /api/artists).
         * - O segundo aponta para a raiz (usado só como referência).
         */
        servers: [
            { url: "http://localhost:3000/api", description: "Local" },
            { url: "http://localhost:3000", description: "Local (raiz)" },
        ],

        /*
         * TAGS: agrupam os endpoints por tema na interface.
         * Cada rota declara sua tag no "tags: [...]" para aparecer
         * dentro do grupo correto.
         */
        tags: [
            { name: "Artists", description: "Gestão de artistas" },
            { name: "Albums", description: "Gestão de álbuns" },
            { name: "Songs", description: "Gestão de músicas" },
            { name: "Search", description: "Busca global" },
        ],

        /*
         * ─────────────────────────────────────────────────────
         * COMPONENTES: schemas reutilizáveis
         * ─────────────────────────────────────────────────────
         * Aqui definimos a "forma" dos objetos que a API devolve
         * e recebe. Depois, em qualquer rota, basta referenciar com
         * $ref: "#/components/schemas/NomeDoSchema".
         *
         * Separamos dois tipos por entidade:
         * - "Artist"/"Album"/"Song"      -> saída (resposta do GET)
         * - "ArtistInput"/"AlbumInput"/"SongInput" -> entrada (body do POST/PUT)
         */
        components: {
            schemas: {
                /*
                 * SCHEMA ARTIST (resposta)
                 * Representa como o artista é devolvido pela API.
                 * Serve como "moldura" na documentação — exemplos
                 * mostram preenchimento para o professor entender.
                 */
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

                /*
                 * SCHEMA ARTISTINPUT (requisição)
                 * Só o "name" é obrigatório — o "required": ["name"]
                 * diz ao Swagger UI para marcar os campos exigidos
                 * e recusar o envio sem eles.
                 */
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

                /*
                 * SCHEMA ALBUM (resposta)
                 * Inclui artistId para mostrar a FK ao artista.
                 */
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

                /*
                 * SCHEMA ALBUMINPUT (requisição)
                 * Obrigatórios: title e artistId.
                 * (O artista precisa existir; o controller valida isso
                 * e devolve 404 se o ID informado não existir.)
                 */
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

                /*
                 * SCHEMA SONG (resposta)
                 * Inclui albumId e artistId para mostrar as duas FKs.
                 */
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

                /*
                 * SCHEMA SONGINPUT (requisição)
                 * Obrigatórios: title e albumId.
                 * O "artistId" tem description explicando a regra
                 * especial: se omitido, herda do álbum. Isso aparece
                 * como tooltip no Swagger UI, alertando o professor
                 * e os demais integrantes.
                 */
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

                /*
                 * SCHEMA ERROR (resposta de erro)
                 * Reutilizado em todos os 400/404/500.
                 * Mantém o formato { error: "mensagem" } uniforme.
                 */
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Artista não encontrado.",
                        },
                    },
                },

                /*
                 * SCHEMA PAGINATIONMETA (bloco "meta" das listagens)
                 * Devolvido em todas as respostas paginadas para que
                 * o frontend calcule a paginação (quantas páginas
                 * existem, onde estamos, etc.).
                 */
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

        /*
         * ─────────────────────────────────────────────────────
         * PATHS: todos os endpoints documentados
         * ─────────────────────────────────────────────────────
         * Cada chave é um caminho RELATIVO ao server.
         * Ex: "/artists" com server "http://localhost:3000/api"
         *     vira "http://localhost:3000/api/artists".
         *
         * Dentro de cada rota, GET/POST/PUT/DELETE são declarados
         * como propriedades do objeto. Cada um tem:
         * - tags:  grupo no Swagger UI
         * - summary: título curto do card
         * - parameters: parâmetros (query, path)
         * - requestBody: corpo aceito no POST/PUT
         * - responses: códigos HTTP e o que devolvem
         * ─────────────────────────────────────────────────────
         */
        paths: {
            /* ---------------- ARTISTS ---------------- */

            /*
             * /artists
             * - GET: lista paginada com filtro opcional de gênero
             * - POST: cria um novo artista
             */
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
                                            // data é um array de Artist
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Artist" },
                                            },
                                            // meta traz a paginação
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
                    // Corpo esperado: ArtistInput (name obrigatório)
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
                        // 400 quando falta nome, URL inválida ou nome duplicado
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

            /*
             * /artists/{id}
             * Operações sobre um artista específico.
             * "{id}" é parâmetro de caminho (path param).
             */
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
                    // Reutiliza ArtistInput — o controller permite body parcial
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
                        "204": { description: "Removido" },   // 204 = sem corpo
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
                        // 404: o artistId informado não existe no banco
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
                        // 404: albumId ou artistId informado não existe
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

            /*
             * /search
             * Busca global. Roda as três consultas em paralelo e
             * devolve os resultados agrupados:
             *   data.artists / data.albums / data.songs
             *
             * O frontend usa essa estrutura para renderizar três
             * containers distintos na página de busca.
             */
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

    /*
     * "apis" vazio: todas as rotas estão declaradas inline acima.
     * Se no futuro o time quiser usar anotações JSDoc (@openapi)
     * nos controllers, basta trocar para algo como
     * apis: ["./src/routes/*.ts"].
     */
    apis: [], // tudo declarado inline; não depende de JSDoc nos arquivos
};

/*
 * swaggerJsdoc() compila o objeto "options" no formato final
 * aceito pelo Swagger UI. Este é o objeto exportado e usado
 * em index.ts para montar a página /api-docs.
 */
export const swaggerSpec = swaggerJsdoc(options);