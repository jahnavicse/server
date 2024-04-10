import express from 'express';
import { addProd, showProd, deleteProd, updateProd } from '../controllers/prodController.js';

const prodRouter = express.Router();

prodRouter.post("/add", addProd);
prodRouter.get("/show", showProd);
prodRouter.delete("/:id", deleteProd);
prodRouter.put("/:id", updateProd);

export default prodRouter;
