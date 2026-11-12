import { ParsedQs } from "qs";

/**
 * Formato padrão de paginação retornado por parsePagination().
 * - page:   número da página atual (começa em 1)
 * - limit:  quantos registros por página
 * - offset: quantos registros pular no banco antes de começar a listar
 *           (offset = (page - 1) * limit)
 */
export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

/**
 * Lê os parâmetros ?page= e ?limit= da URL de forma segura.
 *
 * Por que existe: se o usuário digitar ?page=abc ou ?limit=-5, o Sequelize
 * quebraria. Esta função força valores válidos.
 *
 * Regras:
 * - page inválida ou <= 0  -> assume 1
 * - limit inválido ou <= 0 -> assume 20
 * - limit maior que 100    -> trava em 100 (protege o servidor)
 */
export function parsePagination(query: ParsedQs): PaginationParams {
    const pageRaw = Number(query.page);
    const limitRaw = Number(query.limit);

    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    let limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 20;
    if (limit > 100) limit = 100;

    return { page, limit, offset: (page - 1) * limit };
}

/**
 * Converte o ":id" da URL em número inteiro positivo.
 *
 * Por que existe: o Express entrega req.params.id como TEXTO ("1"),
 * e o Sequelize precisa de número (1). Se não for número válido,
 * retorna null para o controller responder 400.
 *
 * O Express 5 pode entregar um array quando a rota é repetida,
 * por isso a assinatura aceita string | string[].
 */
export function parseId(raw: string | string[] | undefined): number | null {
    if (raw === undefined) return null;

    // Se vier array, pega o primeiro elemento
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value === undefined) return null;

    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Normaliza um texto opcional vindo do body da requisição.
 *
 * O que faz:
 * - undefined / null / "" -> retorna null (campo não enviado)
 * - se não for string     -> retorna null (protege contra números/objetos)
 * - se for string         -> remove espaços nas pontas e devolve
 *
 * Uso típico: const title = optionalString(req.body?.title)
 */
export function optionalString(value: unknown): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") return null;
    return value.trim();
}

/**
 * Extrai uma mensagem legível de qualquer erro capturado no catch.
 *
 * Por que existe: o Express 5 pode lançar qualquer tipo de valor (Error,
 * string, objeto). Esta função garante que sempre vamos ter um texto
 * para devolver no JSON de erro.
 */
export function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}