import { Router } from "express";
import {
    listArtists,
    getArtist,
    createArtist,
    updateArtist,
    deleteArtist,
} from "../controllers/artistController";
import { protect } from "../middlewares/protect";

const router = Router();

router.get("/", listArtists);
router.get("/:id", getArtist);

// Escrita protegida pelo guard opcional.
// Quando o Integrante 1 entregar o JWT, a proteção liga sozinha.
router.post("/", protect, createArtist);
router.put("/:id", protect, updateArtist);
router.delete("/:id", protect, deleteArtist);

export default router;