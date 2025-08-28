import express from "express";
import mongoose from "mongoose";
import data from "./dataCollection.js";
import Videos from "./dbModel.js";
import bcrypt from "bcrypt";
import User from "./userModel.js";
import jwt from "jsonwebtoken";

const app = express();
const port = 8080;

app.use(express.json());
app.use((req, res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*"),
  res.setHeader("Access-Control-Allow-Headers","*"),
  next();
});

const connection_url = "mongodb+srv://Admin:QwaS1234@tiktokapp.nvnyqks.mongodb.net/?retryWrites=true&w=majority&appName=TiktokApp";

mongoose.connect(connection_url)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
// const alpha (()=>{

//     if (post == 'null')
//     {
//         console.log('working');
//     }
//     else{
//         console.log('it terminates');
//     }
// });

app.get("/", (req, res) => res.status(200).send("hello world"));
app.get("/v1/posts", (req, res) => res.status(200).send(data));
app.get("/v2/posts",(req, res)=>{
      Videos.find(req.body)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err));
})
// app.post("/v2/posts", (req, res) => {
//   const dbVideos = req.body;

//   Videos.create(dbVideos, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });
app.post('/v2/posts', (req, res) => {
  Videos.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send(err));
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token (optional)
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`✅ Server listening on http://localhost:${port}`));