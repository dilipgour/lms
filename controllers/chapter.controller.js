import { db } from "../lib/db.js";
import { courses ,chapters,muxData,purchases,attachments} from "../schema.js";
import { aggregateResults } from "../lib/aggregatedResult.js"
import { eq ,and,desc,asc,gt} from "drizzle-orm"
import Mux from '@mux/mux-node';


const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});


export const addChapter = async (req,res)=>{
  const { courseId } = req.params;
  const { userId } = req.user;
  const { title } = req.body;
  try{
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
        const lastchapter = await db.select().from(chapters).where(eq(chapters.courseId,courseId)).orderBy(desc(chapters.position)).limit(1)
        
        const position = lastchapter.length ? lastchapter[0].position+1:1
        
        const chapter = await db.insert(chapters).values({
          title,
          courseId,
          position
        }).returning()
        
        return res.status(200).json(chapter[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}



export const reorderChapter = async (req,res)=>{
  const { courseId } = req.params;
  const { userId } = req.user;
  const { list } = req.body;
  
  try{
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
        
        for(let item of list){
          await db.update(chapters)
  .set({position:item.position+1})
  .where(eq(chapters.id, item.id))
        }
        
        return res.status(200).send("success")
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}

export const getChapter = async (req,res)=>{
  const { courseId,chapterId } = req.params;
  const { userId } = req.user;
  
  
  try{
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
        
        const chapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          )).leftJoin(muxData, eq(chapters.id, muxData.chapterId))
                      
                      
          
        
        
        return res.status(200).json(chapter[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}


export const editChapter = async(req,res)=>{
  
  const { chapterId,courseId } = req.params;
  const { isPublished,...values} = req.body
  console.log(values)
  try{
  
  const updatedchapter = await db.update(chapters)
  .set({...values})
  .where(eq(chapters.id, chapterId))
  .returning();
  
  if(values.videoUrl){
    
    const existingMuxdata = db.select().from(muxData).where(eq(muxData.chapterId,chapterId))
    
    if(existingMuxdata.length){
      await mux.video.assets.del(existingMuxdata.assetId)
      await db.delete(muxData).where(eq(muxData.id,existingMuxdata.id))
       
    }
  const asset = await mux.video.assets.create({
  input: [{ url: values.videoUrl }],
  playback_policy: ['public'],
  encoding_tier: 'baseline',
});

const newMuxdata = await db.insert(muxData).values({
  chapterId,
  assetId:asset.id,
  playbackId:asset.playback_ids?.[0]?.id
  })
}
  
  const chapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          )).leftJoin(muxData, eq(chapters.id, muxData.chapterId))
          
  res.status(200).json(chapter[0])
}catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}


export const deleteChapter = async (req,res)=>{
  const { courseId,chapterId } = req.params;
  const { userId } = req.user;
  
  
  try{
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
        
        const chapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          ))
          
          if(chapter.length==0){
          res.status(404).json({error:"course not found"})
        }
      
      if(chapter.videoUrl){
        const existingMuxdata = db.select().from(muxData).where(eq(muxData.chapterId,chapterId))
        if(existingMuxdata.length){
          await mux.video.assets.del(existingMuxdata.assetId)
      await db.delete(muxData).where(eq(muxData.id,existingMuxdata.id))
        }
      }
      
      const deletedChapter = await db.delete(chapters)
  .where(eq(chapters.id, chapterId))
  .returning();
      
   const publishedChaptersInCourse = await db.select().from(chapters).where(and(
     eq(chapters.id,chapterId),
     eq(chapters.isPublished,true),
     )).limit(1)   
     
     if(!publishedChaptersInCourse.length){
       await db.update(courses)
  .set({isPublished:false})
  .where(eq(courses.id, courseId))
     }
                      
          
        
         return res.status(200).json(deletedChapter[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}



export const publishChapter = async(req,res)=>{
  const { courseId,chapterId } = req.params;
  const { userId } = req.user;
  
  
  try{
  const course= await db
        .select()
        .from(courses)
        .where( and (
          eq(courses.id, courseId),
          eq(courses.userId,userId)
          ))
        
        if(course.length==0){
         return  res.status(404).json({error:"course not found"})
        }
        
        
        const chapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          ))
          
          if(!chapter.length){
            return res.status(404).json({error:"chapter not found"})
          }
          
  const existingmuxData  = await db.select().from(muxData).where(eq(muxData.chapterId,chapterId))        
  
  
  if(!existingmuxData.length || !chapter[0].title.length  || !chapter[0].description.
  length||  !chapter[0].videoUrl.length){
          return res.status(400).json({error:"Missing required fields"})
          }
          
        
        await db.update(chapters)
                .set({isPublished:true})
                .where(eq(chapters.id, chapterId))
  
        
        const updatedChapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          )).leftJoin(muxData, eq(chapters.id, muxData.chapterId))
          
        
        return res.status(200).json(updatedChapter[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}


export const unpublishChapter = async(req,res)=>{
  const { courseId,chapterId } = req.params;
  const { userId } = req.user;
  
  
  try{
  const course= await db
        .select()
        .from(courses)
        .where( and (
          eq(courses.id, courseId),
          eq(courses.userId,userId)
          ))
        
        if(course.length==0){
         return  res.status(404).json({error:"course not found"})
        }
        
        const chapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          ))
          
          if(!chapter.length){
            return res.status(404).json({error:"chapter not found"})
          }
          
  
        await db.update(chapters)
                .set({isPublished:false})
                .where(eq(chapters.id, chapterId))
  
    const publishedChaptersIncourse = await db.select().from(chapters).where(eq(chapters.courseId,courseId))
    
    if(!publishedChaptersIncourse.length&&course.isPublished){
      await db.update(courses).set({isPublished:false})
    }
        
        const updatedChapter = await db
        .select()
        .from(chapters)
        .where( and (
          eq(chapters.id, chapterId),
          eq(chapters.courseId, courseId),
          )).leftJoin(muxData, eq(chapters.id, muxData.chapterId))
          
        
        return res.status(200).json(updatedChapter[0])
  }catch(error){
  console.log(error)
  res.status(500).json({ error: "something went wrong" });
}
}


export const getChapterForStream = async(req,res)=>{
  const { courseId,chapterId }= req.params
  const { userId } = req.user;
  
  const isPurchased = await db
                    .select()
                    .from(purchases)
                    .where(and(
                      eq(purchases.courseId,courseId),
                      eq(purchases.userId,userId)
                      ))
  
  const course = await db
                 .select()
                 .from(courses)
                 .where(and(
                     eq(courses.id,courseId),
                     eq(courses.isPublished,true)
                     ))
                     
  if(!course.length){
    return res.status(404).json({error:"course not found"})
  }
  const chapter = await db
                  .select()
                  .from(chapters)
                  .where(and(
                    eq(chapters.id,chapterId),
                    eq(chapters.isPublished,true)
                    ))
                    
   if(!chapter.length){
    return res.status(404).json({error:"chapter not found"})
  }
  let muxdata = null;
  let courseAttachments = null;
  let nextChapter = null;
  
  if(isPurchased.length){
    console.log("first")
    courseAttachments = await db
                         .select({
                           id:attachments.id,
                           name:attachments.name,
                           url:attachments.url,
                           courseId:attachments.courseId
                         })
                         .from(attachments)
                         .where(
                           eq(attachments.courseId,courseId)
                         )
  }
  
  if(chapter[0].isFree||isPurchased.length){
    console.log("go for mux")
    muxdata = await db
              .select()
              .from(muxData)
              .where(
                eq(muxData.chapterId,chapterId)
                )
    nextChapter = await db
                  .select()
                  .from(chapters)
                  .where(and(
                   gt(chapters.position,chapter[0].position),
                   eq(chapters.isPublished,true)
                    )).orderBy(asc(chapters.position))
  }
  
  

  
  
  res.status(200).json({
  course,
  chapter,
  muxdata,
  courseAttachments,
  nextChapter,
  isPurchased
 })
}