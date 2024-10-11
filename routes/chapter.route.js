import express from "express"

import auth from "../middlewares/auth.middleware.js"
import { addChapter,reorderChapter,getChapter,editChapter, deleteChapter, publishChapter, unpublishChapter,getChapterForStream} from "../controllers/chapter.controller.js"

const router = express.Router()



router.post('/:courseId/chapters',auth,addChapter)
router.get('/:courseId/getchapterforstream/:chapterId',auth,getChapterForStream)
router.put('/:courseId/chapters/reorder',auth,reorderChapter)
router.get('/:courseId/chapters/:chapterId',auth,getChapter)
router.patch('/:courseId/chapter/:chapterId',auth,editChapter)
router.patch('/:courseId/chapter/:chapterId/publish',auth,publishChapter)
router.patch('/:courseId/chapter/:chapterId/unpublish',auth,unpublishChapter)
router.delete('/:courseId/chapter/:chapterId',auth,deleteChapter)

export default router