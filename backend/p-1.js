// const express = require("express");
// const app = express();

// const PORT = 3000;

// app.get("/", (req, res) => {
//   res.send("server is running");
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// express-server.js
const express = require("express");
const app = express();
// import {User} from './Models/User.model.js'
const User = require("./src/Models/User.model.js");

const mongoose = require("mongoose");
const PORT =process.env.PORT ||  3000;
const MongoDB_Url= "mongodb+srv://kolarnagaraju_db_user:@cluster0.0uiweuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use(express.json())

async function connectDB() {
  try {
    await mongoose.connect(MongoDB_Url);
    console.log(" Connected to MongoDB ");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
}

connectDB()

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("about Page");
});

app.post("/api/User", async (req,res) =>{
  try{
    const user= await User.create(req.body)
    console.log(req.body)
    res.json(user)
  }
  catch(error){
    res.json(error)
  }
})

app.get("/api/User/:fullname",async (req,res) =>{
  try{
    const getuser=await User.findOne({Fullname: req.params.fullname});
    if(!getuser){
      res.send("user not found")
    }
    res.json(getuser)
    console.log(getuser)
  }
    catch(error){
    res.json(error)
  }

})
app.put("/api/User/:fullname", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { Fullname: req.params.fullname },  req.body, 
      { new: true }   // return updated document                    
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json(updatedUser);       
    console.log(updatedUser);    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});



