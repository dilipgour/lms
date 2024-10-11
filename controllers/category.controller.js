import { asc } from "drizzle-orm"

import { db } from "../lib/db.js"
import { category } from "../schema.js";

export const getCategories = async(req,res)=>{
  try{
    const categories = await db.select().from(category).orderBy(asc(category.name))
    res.status(200).json(categories)
  }catch(error){
    console.log(error)
    res.status(500).json({error:"Something went wrong"})
  }
}