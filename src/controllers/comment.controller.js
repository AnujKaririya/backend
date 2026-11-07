import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 2} = req.query
    const pageNumber=Number(page)
    const limitNumber=Number(limit)
    const comments=await Comment.find({video:videoId}).select("content")
    .skip((pageNumber-1)*limitNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    return res.status(200).json(
        new ApiResponse(200, comments, "these are video comments")
    )
})


const addComment = asyncHandler(async (req, res) => {
    // Get video ID from URL
    const { videoId } = req.params;
    // Get comment content from request body
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }
    // Check whether video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // Create comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });
    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});


const updateComment = asyncHandler(async (req, res) => {
    // Get comment ID from URL
    const { commentId } = req.params;
    // Get comment content from request body
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }
    // Check whether comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "comment not found");
    }
    // Check comment ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot update someone else's comment");
    }
    // update comment
    const updated = await Comment.findByIdAndUpdate(
        commentId,
        { $set: {content}},
        { new: true, runValidators: true }
    )
    return res.status(200).json(
        new ApiResponse(200, updated, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // Get comment ID from URL
    const { commentId } = req.params;
    // Check whether comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "comment not found");
    }
    // Check comment ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete someone else's comment");
    }
    // delete comment
    const deleted = await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(
        new ApiResponse(200, deleted, "Comment deleted successfully")
    );  
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }