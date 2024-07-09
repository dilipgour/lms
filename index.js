import  express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing.js";
 
 import authRoutes from "./routes/auth.route.js"
import courseRoutes from "./routes/course.route.js"

const app = express()
const port = process.env.PORT||9000

app.use(cors(
  {origin:["http://localhost:5173"],
credentials: true
 }))

app.use(express.json())
app.use(cookieParser())

app.use("/api/uploadthing", createRouteHandler({
  router: uploadRouter,
  config: { },
}));

app.use('/api/auth',authRoutes)
app.use('/api/courses',courseRoutes)

app.listen(port,async()=>{
  console.log(`app is lisning on : ${port}`)
  
})

