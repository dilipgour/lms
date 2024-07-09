import jwt from "jsonwebtoken"

const generateToken =(userId,res)=>{
  
  const token = jwt.sign({userId},process.env.JWT_SECREAT,{ expiresIn: '1d' })
  res.cookie("accessToken",token,{maxAge:86400000})
  
}

export default generateToken