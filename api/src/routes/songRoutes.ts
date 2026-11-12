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

router.get("/", listSongs);
router.get("/:id", getSong);

router.post("/", protect, createSong);
router.put("/:id", protect, updateSong);
router.delete("/:id", protect, deleteSong);

export default router;