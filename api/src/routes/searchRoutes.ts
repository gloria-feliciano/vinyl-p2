import { Router } from "express";
import { search } from "../controllers/searchController";

const router = Router();

// Busca é pública (busca.html usa sem login).
// GET /search?q=termo&limit=20
router.get("/", search);

export default router;