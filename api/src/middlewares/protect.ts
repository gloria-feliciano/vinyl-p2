import { NextFunction, Request, Response } from "express";

/**
 * Guard OPCIONAL de autenticação.
 *
 * Por que existe: o Integrante 1 é responsável pelo JWT, mas ainda
 * pode não ter entregado. Sem esse guard, toda rota ficaria aberta
 * ou toda rota quebraria. A solução é um "guarda inteligente":
 *
 * 1. Tenta carregar o middleware real do Integrante 1
 *    (../middlewares/auth.middleware).
 * 2. Se o arquivo existir e exportar uma função, usa ela.
 * 3. Se NÃO existir, libera a requisição e avisa no console.
 *
 * Resultado:
 * - Hoje a API funciona sozinha (demonstração não trava).
 * - Quando o I1 entregar o JWT, a proteção liga automaticamente
 *   sem precisar alterar nenhum arquivo.
 *
 * Variável de ambiente AUTH_ENFORCED=true força 401 quando não
 * há middleware disponível (útil para a entrega final).
 */

// Formato esperado do middleware do Express
type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => unknown;

/**
 * Tenta importar o auth.middleware do Integrante 1.
 * Retorna a função ou null se o arquivo não existir.
 *
 * Aceita três nomes de export comuns: authMiddleware, autenticar, default.
 */
function carregarMiddlewareReal(): Middleware | null {
    try {
        // Import dinâmico para não quebrar a compilação caso
        // o arquivo ainda não exista.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require("./auth.middleware");
        const candidato =
            mod?.authMiddleware ??
            mod?.autenticar ??
            mod?.default ??
            null;

        return typeof candidato === "function" ? candidato : null;
    } catch {
        // Arquivo não existe ou não compila -> retorna null
        return null;
    }
}

/**
 * Middleware de proteção das rotas de escrita (POST/PUT/DELETE).
 *
 * Fluxo:
 * 1. Se o middleware real existir, delega para ele.
 * 2. Se não existir mas AUTH_ENFORCED=true, retorna 401.
 * 3. Se não existir e AUTH_ENFORCED != true, libera com aviso.
 */
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