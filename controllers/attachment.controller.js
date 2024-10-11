import { db } from "../lib/db.js";
import { courses ,attachments } from "../schema.js";
import { eq ,and } from "drizzle-orm"




export const addAttachment = async (req,res)=>{
  const { courseId } = req.params;
  const { userId } = req.user;
  const { url } = req.body;
  
  
  
  try{
  const course= await db
        .select()
        .from(courses)
        .where( and (
          eq(courses.id, courseId),
          eq(courses.userId,userId)
          ))
        
        if(course.length==0){
          return res.status(404).json({error:"course not found"})
        }
        
        const attatchment = await db.insert(attachments).values({
          url,
          name : url.split('/').pop(),
          courseId
        }).returning()
        
        return res.status(200).json(attatchment[0])
  }catch(error){
  console.log(error)
  return res.status(500).json({ error: "something went wrong" });
}
}


export const deleteAttachment = async (req,res)=>{
  const { courseId ,attatchmentId} = req.params;
  const { userId } = req.user;
  
  
  try {
  const course= await db
        .select()
        .from(courses)
        .where( and (
          eq(courses.id, courseId),
          eq(courses.userId,userId)
          ))
        
        if(course.length==0){
          res.status(404).json({error:"course not found"})
        }
        const attatchment = await db.select().from(attachments).where(eq(attachments.id,attatchmentId))
        
        if(attatchment.length==0){
          res.status(404).json({error:"attatchment not found"})
        }
        
        await db.delete(attachments)
  .where(eq(attachments.id, attatchmentId))
  
        return res.status(200).json(attatchment[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}
