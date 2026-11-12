import { Router } from "express";
import { search } from "../controllers/searchController";

const router = Router();

// Busca é pública (o frontend usa em busca.html sem login)
router.get("/", search);

export default router;