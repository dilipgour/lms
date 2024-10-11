import { db } from "../lib/db.js";
import { courses ,attachments,chapters,muxData,category,purchases} from "../schema.js";
import { aggregateResults,aggregateResultsForStream } from "../lib/aggregatedResult.js"
import { eq ,and,desc,asc,like} from "drizzle-orm"
import Mux from '@mux/mux-node';
import { backendClient } from "../lib/edgestore-server.js"


const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});



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
    
        
        const rows = await db
    .select()
    .from(courses)
    .where(and(
      eq(courses.id, courseId),
      eq(courses.userId, userId)
    ))
    .leftJoin(attachments, eq(courses.id, attachments.courseId))
     .leftJoin(chapters, eq(courses.id, chapters.courseId))
     .orderBy(asc(chapters.position));

if(rows==undefined||rows.length==0){
          res.status(404).json({error:"course not found"})
        }
        
const course= aggregateResults(rows)[courseId];

res.status(200).json(course)
    
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



export const deleteCourse = async(req,res)=>{
  
  const { courseId } = req.params;
  const { userId } = req.user ;
  
  try{
  const course = await db
                 .select()
                 .from(courses)
                  .where(and(
                   eq(courses.id, courseId),
                   eq(courses.userId, userId)
                  ))
                  
     if(!course.length){
       return res.status(404).json({error:"course not found"})
     }
     if(course[0].imageUrl){
     await backendClient.publicFiles.deleteFile({
          url: course[0].imageUrl,
        });
     }
     
     const attachment = await db
                        .select()
                        .from(attachments)
                        .where(eq(attachments.courseId,courseId))
     if(attachment.length>0){
       attachment.forEach( async(elem)=>{
         await backendClient.publicFiles.deleteFile({
          url: elem.url,
        });
       })
     }      
     
     const chapter = await db
                      .select()
                      .from(chapters)
                      .where(
                        eq(chapters.courseId,courseId)
                        )
                        
if(chapter.length){
  chapter.forEach(async(elem)=>{
    if(elem.videoUrl){
      

    const existingMuxdata = db.select().from(muxData).where(eq(muxData.chapterId,elem.id))
    
    if(existingMuxdata.length){
      await mux.video.assets.del(existingMuxdata.assetId)
      await backendClient.publicFiles.deleteFile({
          url: elem.videoUrl,
        });
       
}
    }
    
  })
  
  
  
}


const deletedCourse = await db
                       .delete(courses)
                       .where(and(
                       eq(courses.id, courseId),
                       eq(courses.userId, userId)
                      )).returning()
     
     
     res.status(200).json(deletedCourse)
     
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}





export const publishCourse = async(req,res)=>{
  
  const { courseId } = req.params;
  const { userId } = req.user ;
  try{
  const course = await db
                 .select()
                 .from(courses)
                  .where(and(
                   eq(courses.id, courseId),
                   eq(courses.userId, userId)
                  ))
                  
     if(!course.length){
       return res.status(404).json({error:"course not found"})
     }
     
     
       const chapter = await db
                      .select()
                      .from(chapters)
                      .where(
                        eq(chapters.courseId,courseId)
                        )
                        
            
                        
if(!course[0].title ||!course[0].description ||!course[0].categoryId ||!chapter.length||!course[0].imageUrl||!course[0].price){
  console.log(!course[0].title , !course[0].description, !course[0].categoryId, !chapter.length, !course[0].imageUrl,!course[0].price)
  return res.status(400).json({ error: "Please fill all fields" });
}


const publishedChapters = chapter.filter((chapter)=>chapter.isPublished===true)

console.log(publishedChapters)
if(!publishedChapters.length){
  return res.status(400).json({ error: "Please fill all fields" });
}
     await db
     .update(courses)
     .set({ isPublished: true })
     .where(eq(courses.id, courseId))
     
     res.status(200).send("Course published");
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}



export const unPublishCourse = async(req,res)=>{
  
  const { courseId } = req.params;
  const { userId } = req.user ;
  try{
  const course = await db
                 .select()
                 .from(courses)
                  .where(and(
                   eq(courses.id, courseId),
                   eq(courses.userId, userId)
                  ))
                  
     if(!course.length){
       return res.status(404).json({error:"course not found"})
     }
     
     
    const chapter = await db
                      .select()
                      .from(chapters)
                      .where(and(
                        eq(chapters.courseId,courseId),
                        eq(chapters.isPublished
                        , true)
                        ))
                        
  if(chapter.length>0){
    await db
          .update(chapters)
          .set({ isPublished : false })
          .where(eq(chapters.courseId,courseId))
  }
  
  await db
        .update(courses)
        .set({ isPublished : false })
        .where(eq(courses.id, courseId))
     

     res.status(200).send("Course unpublished");
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}

export const getAllCourses = async(req,res)=>{
  const { userId } = req.user ;
  try{
    const allCourses = await db
                          .select()
                          .from(courses)
                          .where(eq(courses.userId,userId))
                          
    res.status(200).json(allCourses)
  }catch(error){
    console.log(error)
    res.status(500).json({ error: "something went wrong" });
  }
  
}

export const getCourses = async (req, res) => {
  const { userId } = req.user;
  const { title, categoryId } = req.query;
  
  console.log({ title, categoryId ,userId});

  try {
    const conditions = [eq(courses.isPublished, true)];

    if (categoryId !== undefined) {
      conditions.push(eq(courses.categoryId, categoryId));
    }

    if (title && title.trim().length) {
      conditions.push(like(courses.title, `%${title}%`));
    }

    const results = await db
      .select()
      .from(courses)
      .where(and(...conditions))
      .rightJoin(category,eq(courses.categoryId,category.id))
      .orderBy(desc(courses.createdAt));
      
      
      
      


    const formattedCourses = results.map(item => ({
        id: item.courses.id,
        userId: item.courses.userId,
        title: item.courses.title,
        description: item.courses.description,
        imageUrl: item.courses.imageUrl,
        price: item.courses.price,
        isPublished: item.courses.isPublished,
        createdAt: item.courses.createdAt,
        updatedAt: item.courses.updatedAt,
        categories: {
            id: item.categories.id,
            name: item.categories.name
        }
    }));

      res.status(200).json(formattedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
};

export const getCourseForStream = async(req,res)=>{
  const { userId } = req.user;
  const { courseId } = req.params;
  
  if(!courseId||courseId==undefined){
    return res.status(400).json({error:"Missing courseId"})
  }
  
  const course = await db
                .select()
                .from(courses)
                .where(and(
                  eq(courses.id,courseId),
                  eq(chapters.isPublished,true)
                  ))
                .leftJoin(chapters,eq(
                  courses.id,chapters.courseId
                  ))
                .leftJoin(attachments, eq(courses.id, attachments.courseId))
                .leftJoin(category,eq(courses.categoryId,category.id))
                .leftJoin(purchases,and(
                  eq(courses.id,purchases.courseId),
                  eq(userId,purchases.userId)
                  )).orderBy(asc(chapters.position));
                  
const result = aggregateResultsForStream(course)[courseId]
                  
  res.status(200).json(result)
                
}













