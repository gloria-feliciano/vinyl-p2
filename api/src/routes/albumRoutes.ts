import { Router } from "express";
import {
    listAlbums,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
} from "../controllers/albumController";
import { protect } from "../middlewares/protect";

const router = Router();

// GET /albums       -> lista com filtros ?artistId= e ?genre=
// GET /albums/:id   -> detalhe com artista e músicas
// Leitura é pública.
router.get("/", listAlbums);
router.get("/:id", getAlbum);

// Escrita protegida pelo guard opcional
router.post("/", protect, createAlbum);
router.put("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);

export default router;