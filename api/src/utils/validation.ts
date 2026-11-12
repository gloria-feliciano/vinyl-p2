import { ParsedQs } from "qs";

export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

/** Lê ?page= e ?limit= com valores seguros. */
export function parsePagination(query: ParsedQs): PaginationParams {
    const pageRaw = Number(query.page);
    const limitRaw = Number(query.limit);

    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    let limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 20;

    if (limit > 100) limit = 100;

    return { page, limit, offset: (page - 1) * limit };
}

/** Garante que o :id da URL é um inteiro positivo.
 *  O Express 5 tipa req.params.id como string | string[],
 *  por isso a assinatura aceita ambos os formatos. */
export function parseId(raw: string | string[] | undefined): number | null {
    if (raw === undefined) return null;
    // Quando há rota repetida, o Express entrega um array — usamos o primeiro valor
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value === undefined) return null;
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/** Normaliza string opcional vinda do body. */
export function optionalString(value: unknown): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") return null;
    return value.trim();
}

/** Extrai mensagem legível de qualquer erro (Express 5 propaga tudo). */
export function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}