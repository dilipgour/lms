import  express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import courseRoutes from "./routes/course.route.js"
import chapterRoutes from "./routes/chapter.route.js"
import attachmentRoutes from "./routes/attachment.route.js"
import categoryRoutes from "./routes/category.route.js"
import { handler } from "./lib/edgestore-server.js"


const app = express()
const port = process.env.PORT||5000

app.use(cors(
  {origin:["http://localhost:5173"],
credentials: true
 }))

app.use(express.json())
app.use(cookieParser())



app.use((req,res,next)=>{
    console.log(req.url)
  next()
})



app.use('/api/auth',authRoutes)
app.use('/api/courses',courseRoutes)
app.use('/api/courses',attachmentRoutes)
app.use('/api/courses',chapterRoutes)
app.use("/api/categories",categoryRoutes)


app.get('/edgestore/*', handler);
app.post('/edgestore/*', handler);

app.listen(port,async()=>{
  console.log(`app is lisning on : ${port}`)
  
})











