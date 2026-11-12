import { Router } from "express";
import {
    listSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong,
} from "../controllers/songController";
import { protect } from "../middlewares/protect";

const router = Router();

// GET /songs       -> lista com filtros ?albumId= e ?artistId=
// GET /songs/:id   -> detalhe com álbum e artista
router.get("/", listSongs);
router.get("/:id", getSong);

// Escrita protegida pelo guard opcional
router.post("/", protect, createSong);
router.put("/:id", protect, updateSong);
router.delete("/:id", protect, deleteSong);

export default router;