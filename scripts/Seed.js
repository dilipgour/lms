import { db } from "../lib/db.js";
import { category } from "../schema.js";

const seedData = [
    { name: " Computer science " },
    { name: " Photography " },
    { name: " Filming  " },
    { name: " Accounting " },
    { name: " Engineering " },
    { name: " Fitness " },
    { name: " Music " },
];

const main = async () => {
  
  try{
    const data = await db.insert(category).values(seedData);
    console.log("successfull seeded")
  }catch{
    console.log("error seeding db")
  }
};

main()