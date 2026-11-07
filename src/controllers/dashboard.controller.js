import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const videoViews=await Video.find({owner:req.user._id}).select("views")
    const totalViews = videoViews.reduce(
        (total, video) => total + video.views,
        0
    )
    const subscribers=await Subscription.countDocuments({channel:req.user._id})
   
    const videos=await Video.countDocuments({owner:req.user._id})

    const videoIds = videoViews.map(video => video._id)
    const totalVideoLikes = await Like.countDocuments({
        video: { $in: videoIds }
    })

    const comments=await Comment.find({owner:req.user._id}).select("_id")
    const commentIds = comments.map(comment => comment._id)
    const totalCommentLikes = await Like.countDocuments({
        comment: { $in: commentIds }
    })

    const tweets=await Tweet.find({owner:req.user._id}).select("_id")
    const tweetIds = tweets.map(tweet => tweet._id)
    const totalTweetLikes = await Like.countDocuments({
        tweet: { $in: tweetIds }
    })
    const ans={  "TotalVideoLikes":totalVideoLikes,
                 "TotalcommentLikes":totalCommentLikes,
                 "TotalTweetLikes":totalTweetLikes,
                 "totalViews":totalViews,
                 "subscribers":subscribers,
                 "videos":videos
              }

    return res.status(200).json( new ApiResponse(200,ans,"Here is your channel stats"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos=await Video.find({owner:req.user._id}).select("video")
    return res.status(200).json( new ApiResponse(200,videos,"Here is your videos"))
})

const getWatchHistory=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id).select("watchHistory")
    const watchHistory=user.watchHistory
    return res.status(200).json( new ApiResponse(200,watchHistory,"Here is your videos"))
})

const clearWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                watchHistory: []
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            user.watchHistory,
            "Watch history cleared successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos,
    getWatchHistory,
    clearWatchHistory
    }