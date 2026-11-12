import { NextFunction, Request, Response } from "express";

/**
 * Guard OPCIONAL de autenticação.
 *
 * Estratégia à prova de falhas:
 * 1. Tenta carregar o middleware real do Integrante 1 (../middlewares/auth.middleware).
 * 2. Se o arquivo existir e exportar uma função, usa ela.
 * 3. Se NÃO existir, libera a requisição e avisa no console.
 *
 * Assim:
 * - Hoje a API funciona sozinha (demonstração não trava).
 * - Quando o Integrante 1 entregar o JWT com export default,
 *   a proteção liga automaticamente, sem alterar nenhum arquivo.
 *
 * Variável de ambiente AUTH_ENFORCED=true força 401 quando não há
 * middleware disponível (útil na entrega final).
 */

type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => unknown;

function carregarMiddlewareReal(): Middleware | null {
    try {
        // Import dinâmico para não quebrar a compilação caso o
        // arquivo ainda não exista.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require("./auth.middleware");
        const candidato =
            mod?.authMiddleware ??
            mod?.autenticar ??
            mod?.default ??
            null;

        return typeof candidato === "function" ? candidato : null;
    } catch {
        return null;
    }
}

export function protect(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const middlewareReal = carregarMiddlewareReal();

    if (middlewareReal) {
        middlewareReal(req, res, next);
        return;
    }

    if (process.env.AUTH_ENFORCED === "true") {
        res.status(401).json({
            error: "Não autorizado",
            message:
                "Autenticação obrigatória. Envie o header Authorization: Bearer <token>.",
        });
        return;
    }

    console.warn(
        "[protect] auth.middleware.ts ainda não existe. Rota liberada temporariamente."
    );
    next();
}

export default protect;