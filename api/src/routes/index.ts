import { Router } from "express";
import artistRoutes from "./artistRoutes";
import albumRoutes from "./albumRoutes";
import songRoutes from "./songRoutes";
import searchRoutes from "./searchRoutes";

// Roteador raiz das rotas /api
const router = Router();

/* ------------------------------------------------------------------
 * ROTAS DO CATÁLOGO MUSICAL (Integrante 2)
 * ------------------------------------------------------------------
 * Cada linha liga um prefixo a um sub-roteador.
 * Ex: /api/artists  -> artistRoutes
 * ------------------------------------------------------------------ */
router.use("/artists", artistRoutes);
router.use("/albums", albumRoutes);
router.use("/songs", songRoutes);
router.use("/search", searchRoutes);

/* ------------------------------------------------------------------
 * PONTO DE EXTENSÃO PARA AS OUTRAS FRENTES
 * ------------------------------------------------------------------
 * Deixar comentado aqui documenta onde cada integrante pluga
 * suas rotas sem conflito.
 *
 * Integrante 1 (Auth):   router.use("/auth", authRoutes);
 *                        router.use("/users", userRoutes);
 * Integrante 3 (Social): router.use("/reviews", reviewRoutes);
 *                        router.use("/ratings", ratingRoutes);
 *                        router.use("/favorites", favoriteRoutes);
 * ------------------------------------------------------------------ */

export default router;