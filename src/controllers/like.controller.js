import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // Check whether video exists
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
    // Check whether user already liked this video
    const videoLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    // If already liked, remove the like
    if (videoLike) {
        await Like.findByIdAndDelete(videoLike._id);

        return res.status(200).json(
            new ApiResponse(200, null, "Video like removed")
        );
    }

    // Otherwise, create a new like
    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, like, "Video liked successfully")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // Check whether comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new ApiError(404, "comment not found");
        }
    // Check whether user already liked this comment
    const commentLike = await Like.findOne({
        comment:commentId,
        likedBy: req.user._id
    });

    // If already liked, remove the like
    if (commentLike) {
        await Like.findByIdAndDelete(commentLike._id);

        return res.status(200).json(
            new ApiResponse(200, null, "comment like removed")
        );
    }

    // Otherwise, create a new like
    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, like, "comment liked successfully")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const videos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null },//video field must not be empty
        comment: null,
        tweet: null
    })
    .select("video")
    .populate("video") // get video details not onlyobject id

    return res.status(200).json(
        new ApiResponse(200, videos, "These are your liked videos")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}