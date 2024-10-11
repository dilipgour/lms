import express from "express"

import auth from "../middlewares/auth.middleware.js"
import { addAttachment , deleteAttachment } from "../controllers/attachment.controller.js"

const router = express.Router()






router.post('/:courseId/attachment',auth,addAttachment)
router.delete('/:courseId/attachment/:attatchmentId',auth,deleteAttachment)


export default router
