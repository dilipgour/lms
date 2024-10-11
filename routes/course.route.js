import express from "express"

import auth from "../middlewares/auth.middleware.js"
import { createCourse, getCourse, editCourse, deleteCourse, publishCourse, unPublishCourse , getAllCourses, getCourses ,getCourseForStream} from "../controllers/course.controller.js"

const router = express.Router()

// Course routes
router.get('/get',auth,getCourses)
router.get('/getAll',auth,getAllCourses)
router.get('/:courseId',auth,getCourse)
router.get('/getforstream/:courseId',auth,getCourseForStream)
router.post('/',auth,createCourse)
router.patch('/:courseId',auth,editCourse)
router.patch('/:courseId/publish',auth,publishCourse)
router.patch('/:courseId/unpublish',auth,unPublishCourse)
router.delete('/:courseId',auth,deleteCourse)






export default router