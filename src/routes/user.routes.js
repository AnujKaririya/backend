import { Router } from "express";
import { registerUser,loginUser,logoutUser,changeCurrentPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
const userRouter=Router();

userRouter.route("/register").post(upload.fields(
    [
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]
)
,registerUser)

userRouter.route("/loginUser").post(loginUser)
userRouter.route("/logoutUser").post(verifyJWT,logoutUser)
userRouter.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)


export {userRouter};