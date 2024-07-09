import { db } from "../lib/db.js";
import { courses } from "../schema.js";
import { eq ,and} from "drizzle-orm"


export const createCourse = async(req,res)=>{
  const { title } = req.body
  const { userId } = req.user
  try{
  const newcourse = await db.insert(courses).values({title,userId}).returning();
    
    res.status(200).json(newcourse[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}

export const getCourse = async(req,res)=>{
  const { courseId } = req.params
  const { userId } = req.user
  
  try{
    const course= await db
        .select()
        .from(courses)
        .where( and (
          eq(courses.id, courseId),
          eq(courses.userId,userId)
          ));
        
        if(course.length==0){
          res.status(404).json({error:"course not found"})
        }
        
        res.status(200).json(course[0])
    
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}


export const editCourse = async(req,res)=>{
  
  const { courseId } = req.params;
  try{
  
  const updatedCourse = await db.update(courses)
  .set(req.body)
  .where(eq(courses.id, courseId))
  .returning();
  res.status(200).json(updatedCourse)
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}