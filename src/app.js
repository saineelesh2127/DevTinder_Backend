const express = require("express");
 
const connectDB=require('./config/database');
const app = express();
const User=require('./models/user')
 
app.use(express.json());
 
 
app.post("/signup",async (req,res)=>{
  const user=new User(req.body);
  try{
    await user.save()
    res.send("User added successfully");
  }catch(err){
res.status(400).send("Error:"+err.message);
  }
 
})
//find user by emailid
app.get("/user", async(req,res)=>{
  const useremail=req.body.emailId;
  try{
    const users=await User.find({emailId:useremail});
    if(users.length===0){
      res.status(404).send("user not found");
    }else{
      res.send(users);
    }
   
  } catch(err){
res.status(400).send("Something went wrong");
  }
})
 
 
//find all the users
app.get("/feed", async(req,res)=>{
  try{
    const users= await User.find({});
    res.send(users);
 
  }catch(err){
    res.status(400).send("Something went wrong");
      }
})
 
 
//delete an user
app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;
  try{
    const user=await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
 
  }catch(err){
    res.status(400).send("Something went wrong");
      }
});
 
 
//update an user
app.patch("/user",async(req,res)=>{
  const userId=req.body.userId;
  const data=req.body;
  try{
    const user=await User.findByIdAndUpdate({_id:userId},data);
    res.send("user updated successfully");
 
 
  }catch(err){
    res.status(400).send("Something went wrong");
      }
});
 
connectDB().then(()=>{
  console.log("DB connection establised");
  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
}).catch((err)=>{
  console.error("DB connection failed");
});
 
 