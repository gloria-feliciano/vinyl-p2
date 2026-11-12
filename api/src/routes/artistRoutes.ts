import { Router } from "express";
import {
    listArtists,
    getArtist,
    createArtist,
    updateArtist,
    deleteArtist,
} from "../controllers/artistController";
import { protect } from "../middlewares/protect";

// Cria um "roteador" isolado para as rotas de artistas
const router = Router();

// GET /artists       -> lista paginada
// GET /artists/:id   -> detalhe com álbuns e músicas
// Rotas de leitura são públicas.
router.get("/", listArtists);
router.get("/:id", getArtist);

// Rotas de escrita passam pelo guard opcional.
// Quando o Integrante 1 entregar o JWT, a proteção liga sozinha.
router.post("/", protect, createArtist);
router.put("/:id", protect, updateArtist);
router.delete("/:id", protect, deleteArtist);

export default router;