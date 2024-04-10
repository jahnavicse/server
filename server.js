import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/socialdb1');

app.use('/images', express.static('images'));

const SECRET_KEY = 'APIKEY';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure unique email addresses
  pass: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

const todoSchema = mongoose.Schema({
  task: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });

const todoModel = mongoose.model('todos', todoSchema);

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

app.listen(8080, () => {
  console.log('Server Started on port 8080');
});

app.post('/signup', async (req, res) => {
  const { email, name, pass, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already Exists' });
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await userModel.create({
      name: name,
      pass: hashedPassword,
      email: email,
      role: role,
    });
    const token = jwt.sign({ email: newUser.email, role: newUser.role, id: newUser._id }, SECRET_KEY);
    res.status(201).json({ user: newUser, token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { email, pass } = req.body;
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }
    const matchPassword = await bcrypt.compare(pass, existingUser.pass);
    if (!matchPassword) {
      return res.status(400).json({ message: 'Invalid Password' });
    }
    const token = jwt.sign({ email: existingUser.email, role: existingUser.role, id: existingUser._id }, SECRET_KEY);
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized Access' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized Access' });
  }
};

app.get('/todos', auth, async (req, res) => {
  try {
    const tasks = await todoModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/todos', auth, async (req, res) => {
  try {
    const newTodo = new todoModel({
      task: req.body.task,
      userId: req.userId,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const items = await productModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/todos/:id', auth, async (req, res) => {
  try {
    const todo = await todoModel.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.userId.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    await todoModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    req.filePath = `http://localhost:8080/images/${fileName}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

app.post('/products', async (req, res) => {
  try {
    const newProduct = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
