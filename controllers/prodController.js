import prodModel from '../models/prodModel.js';
import jwt from "jsonwebtoken";
const SECRET_KEY = "helloworld";

const addProd=async(req, res)=>{
    const {name, price} = req.body;
    const existingProduct = await prodModel.findOne({ name: name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product Already Exist" });
    } 
    else {
      const result = await prodModel.create({
        name: name,
        price: price
      });
      const token = jwt.sign(
        { name: result.name, price: result.price },
        SECRET_KEY
      );
      res.status(201).json({ msg: result, token: token });
  }
}

const deleteProd = async (req, res) => {
  const id = req.params.id;
  try {
    const Prod = await prodModel.findByIdAndDelete(id);
    res.status(200).json(Prod);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};


const showProd=async(req, res)=>{
  const product = await prodModel.find();
  res.status(201).json({msg: product});
}

const updateProd = async (req, res) => {
  const id = req.params.id;
  const task  = req.body;
  const newTask = {
    name: task.name,
    pass: task.price,
  };
  try {
    await prodModel.findByIdAndUpdate(id, newTask, { new: true });
    res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export {addProd, showProd, deleteProd, updateProd};
