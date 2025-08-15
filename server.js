import express from "express";
import mongoose from "mongoose";
import data from "./dataCollection.js";
import Videos from "./dbModel.js";

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

app.listen(port, () => console.log(`✅ Server listening on http://localhost:${port}`));