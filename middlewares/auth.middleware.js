import jwt from 'jsonwebtoken'
import { db } from "../lib/db.js";
import { user } from "../schema.js";

const auth = async(req,res,next)=>{
  const {accessToken} = req.cookies
  
  if(!accessToken||accessToken==undefined){
    return res.status(401).json({error:"unauthorized"})
  }
  const validate = jwt.verify(accessToken,process.env.JWT_SECREAT)
  if(!validate){
    return res.status(401).json({error:"unauthorized"})
  }
  req.user=validate
  next()
}
export default auth