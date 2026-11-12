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

router.get("/", listAlbums);
router.get("/:id", getAlbum);

router.post("/", protect, createAlbum);
router.put("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);

export default router;