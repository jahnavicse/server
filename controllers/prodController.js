import prodModel from '../models/prodModel.js';
import jwt from "jsonwebtoken";
const SECRET_KEY = "helloworld";

const addProd = async (req, res) => {
    const { name, price } = req.body;
    try {
        const existingProduct = await prodModel.findOne({ name: name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product Already Exist" });
        } else {
            const result = await prodModel.create({
                name: name,
                price: price
            });
            const token = jwt.sign(
                { productId: result._id },
                SECRET_KEY
            );
            res.status(201).json({ msg: result, token: token });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteProd = async (req, res) => {
    const id = req.params.id;
    try {
        const Prod = await prodModel.findByIdAndDelete(id);
        if (Prod) {
            res.status(200).json(Prod);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const showProd = async (req, res) => {
    try {
        const products = await prodModel.find();
        res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const updateProd = async (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;
    const newTask = {
        name: name,
        price: price,
    };
    try {
        const updatedProd = await prodModel.findByIdAndUpdate(id, newTask, { new: true });
        if (updatedProd) {
            res.status(200).json(updatedProd);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { addProd, showProd, deleteProd, updateProd };
