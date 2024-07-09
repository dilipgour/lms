import express from "express"

import auth from "../middlewares/auth.middleware.js"
import { createCourse,getCourse,editCourse} from "../controllers/course.controller.js"

const router = express.Router()


router.post('/',auth,createCourse)
router.get('/:courseId',auth,getCourse)
router.patch('/:courseId',auth,editCourse)
export default router