import { db } from "../lib/db.js";
import { user } from "../schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"
import generateToken from "../lib/generateToken.js"

const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(401).json({ error: "invalid creadencial" });
    }
    if (!emailregex.test(email)) {
        return res.status(401).json({ error: "invalid email" });
    }
    if (password.length < 5) {
        return res.status(400).json({ error: "password is too short" });
    }

try{

    const existinguser = await db
        .select()
        .from(user)
        .where(eq(user.email, email));

    if (existinguser.length != 0) {
        return res.status(400).json({ error: "user already exists" });
    }
   const hash = await bcrypt.hashSync(password,10)
   const newuser = await db.insert(user).values({ name, email, password:hash }).returning();
    generateToken(newuser[0].id,res)
    
     const userTosend = {
      id: newuser[0].id,
      email:newuser[0].email
     }
    res.json(userTosend);
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
};

export const login = async (req, res) => {
  
  
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: "invalid creadencial" });
    }
    if (!emailregex.test(email)) {
        return res.status(401).json({ error: "invalid email" });
    }
    if (password.length < 5) {
        return res.status(400).json({ error: "password is too short" });
    }
try{
    const existinguser = await db
        .select()
        .from(user)
        .where(eq(user.email, email));

    if (existinguser.length == 0) {
        return res.status(400).json({ error: "user dose not exists" });
    }
    const compare =await bcrypt.compareSync(password,existinguser[0].password)
    if(!compare){
      return res.status(401).json({ error: "wrong creadencial" });
    }
    generateToken(existinguser[0].id,res)
    
    const userTosend = {
      id: existinguser[0].id,
      email:existinguser[0].email
     }
    

    res.status(200).json(existinguser[0]);
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
};


export const logout =(req,res)=>{
  res.cookie("accessToken","",{maxAge:0})
  res.status(200).json({message:"Logout successfully"})
}