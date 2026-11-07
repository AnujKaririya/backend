import { Router } from "express";
import { registerUser,loginUser,logoutUser,changeCurrentPassword,updateAccountDetails,updateUserAvatar,updateUserCoverImage,/*subscribe*/getUserChannelProfile } from "../controllers/user.controller.js";
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
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails)
userRouter.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
userRouter.route("/getUserChannelProfile").post(getUserChannelProfile)
//userRouter.route("/subscribe").post(subscribe)


export {userRouter};