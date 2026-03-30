// const http = require("http");
// const PORT = 5000;
// const server = http.createServer((req, res) => {
//   console.log("server running node")
//   if (req.url === "/") {
//     res.end("server is running node js");
//   } else {
//     res.end("404 Not Found");
//   }
// });

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// node-server.js
// const http = require("http");

// const server = http.createServer((req, res) => {
// //   res.setHeader("Content-Type", "text/plain");

//   if (req.url === "/" && req.method === "GET") {
//     res.end("Home Page");
//   } else if (req.url === "/about" && req.method === "GET") {
//     res.end("About Page");
//   } else if (req.url === "/contact" && req.method === "GET") {
//     res.end("Contact Page");
//   } else {
//     res.statusCode = 404;
//     res.end("404 Not Found");
//   }
// });

// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`✅ Node server running at http://localhost:${PORT}`);
// });

// const express = require("express");
// const app = express();
// // import {User} from './Models/User.model.js'
// const User = require("./src/Models/User.model.js");
// const PORT = process.env.PORT || 3000;


// const mongoose = require("mongoose");
// const MongoDB_Url = "mongodb+srv://kolarnagaraju_db_user:Naga0806@cluster0.0uiweuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// app.use(express.json())
// const cors = require("cors");
// app.use(cors());

// async function connectDB() {
//   try {
//     await mongoose.connect(MongoDB_Url);
//     console.log(" Connected to MongoDB ");
//   } catch (err) {
//     console.error(" MongoDB connection error:", err);
//   }
// }

// connectDB()

// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// app.get("/about", (req, res) => {
//   res.send("about Page");
// });

// app.post("/api/User/register", async (req, res) => {
//   try {
//     const { fullname, username, email, mobile, password } = req.body;
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }]
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with email or username" });
//     }
//     const user = await User.create(req.body)
//     console.log(req.body)
//     res.json(user)
//   }
//   catch (error) {
//     res.json(error)
//   }
// });

// app.post("/api/User/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // typedpaswword!=stored password
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({ message: "Login successful", user });
//   }
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // app.get("/api/User/:fullname",async (req,res) =>{
// //   try{
// //     const getuser=await User.findOne({Fullname: req.params.fullname});
// //     if(!getuser){
// //       res.send("user not found")
// //     }
// //     res.json(getuser)
// //     console.log(getuser)
// //   }
// //     catch(error){
// //     res.json(error)
// //   }
// // });

// // app.put("/api/User/:fullname", async (req, res) => {
// //   try {
// //     const updatedUser = await User.findOneAndUpdate(
// //       { Fullname: req.params.fullname },  req.body, 
// //       { new: true }   // return updated document                    
// //     );

// //     if (!updatedUser) {
// //       return res.status(404).send("User not found");
// //     }

// //     res.json(updatedUser);       
// //     console.log(updatedUser);    
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });



// app.use((req, res) => {
//   res.status(404).send("404 Not Found");
// });

// app.listen(PORT, () => {
//   console.log(`Express server running at http://localhost:${PORT}`);
// });

