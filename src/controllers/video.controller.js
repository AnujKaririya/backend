import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1, query, sortBy, sortType } = req.query
    // Convert pagination values into numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Decide sorting order
    const sortOrder = sortType === "asc" ? 1 : -1;
    // Dynamic sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;
    console.log(sortOptions)

    const videos = await Video.find({
    isPublished: true,
    title: { $regex: query, $options: "i" }
    })
    .sort(sortOptions)
    .skip((pageNumber-1)*limitNumber)
    .limit(limitNumber);
    console.log(videos)
    res.status(200)
    .json(
            new ApiResponse(
                    200, 
                    videos,
                    "these are your vedios"
                    )
                )
    })

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,duration} = req.body
    console.log(req.user.username)
    console.log(title)
    // TODO: get video, upload to cloudinary, create video

    //upload videofile in cloundnary
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
    }
    const videoFileUrl=await uploadOnCloudinary(videoFileLocalPath)
    if(!videoFileUrl){
        throw new ApiError(402,"error in vedioFileUrl")
    }

    //upload thumbnail in cloundnary
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
    }
    const thumbnailUrl=await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnailUrl){
        throw new ApiError(402,"error in thumbnailUrl")
    }

    //creating vedio in database
    const video=await Video.create({
        isPublished:true,
        title,
        description,
        views:0,
        videoFile:videoFileUrl.url,
        thumbnail:thumbnailUrl.url,
        owner:req.user._id,
        duration
    })

    // check for video creation
    if (!video) {
            throw new ApiError(500, "Something went wrong while publishing the video")
    }

    // return res
    return res.status(201).json(
            new ApiResponse(200, video, "video published Successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"no video found")
    }
    return res.status(200).json(
            new ApiResponse(200, video, "here is your vedio")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    console.log("Uploaded file:", req.file);

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {
        const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnailUrl?.url) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

        updateData.thumbnail = thumbnailUrl.url;
    }

    const updated = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updated) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updated, "Video updated successfully")
    );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const deleted=await Video.findByIdAndDelete(videoId)
    if(!deleted){
        throw new ApiError(404,"video not found")
    }
    console.log(deleted)
    res.status(200)
    .json(
        new ApiResponse(200,deleted,"video is deleted")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video publish status updated successfully"
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}