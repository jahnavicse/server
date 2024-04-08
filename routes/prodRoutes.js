import express from 'express'
const prodRouter = express.Router();
import { addProd, showProd, deleteProd, updateProd } from '../controllers/prodController.js'; 
// import { showProd } from '../controllers/prodController';

prodRouter.post("/add", addProd);
prodRouter.get("/show", showProd);
prodRouter.delete("/:id", deleteProd);
prodRouter.put("/:id", updateProd);


export default prodRouter;

