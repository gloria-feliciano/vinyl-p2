import { Router } from "express";
import artistRoutes from "./artistRoutes";
import albumRoutes from "./albumRoutes";
import songRoutes from "./songRoutes";
import searchRoutes from "./searchRoutes";

const router = Router();

/* ------------------------------------------------------------------
 * ROTAS DO CATÁLOGO MUSICAL (Integrante 2)
 * ------------------------------------------------------------------ */
router.use("/artists", artistRoutes);
router.use("/albums", albumRoutes);
router.use("/songs", songRoutes);
router.use("/search", searchRoutes);

/* ------------------------------------------------------------------
 * PONTO DE EXTENSÃO PARA AS OUTRAS FRENTES
 * ------------------------------------------------------------------
 * Integrante 1 (Auth):   router.use("/auth", authRoutes);
 *                        router.use("/users", userRoutes);
 * Integrante 3 (Social): router.use("/reviews", reviewRoutes);
 *                        router.use("/ratings", ratingRoutes);
 *                        router.use("/favorites", favoriteRoutes);
 * ------------------------------------------------------------------ */

export default router;