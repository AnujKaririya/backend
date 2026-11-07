import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }
    const playlist=await Playlist.create(
        {
            name,
            description,
            owner:req.user._id
        }
    )
    return res.status(201).json(
            new ApiResponse(201, playlist, "Playlist created Successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const user_id=await User.findById(userId)
    if(!user_id){
        throw new ApiError(401,"userId is not valid")
    }
    const playlists=await Playlist.find({owner:userId})
    return res.status(200).json(
            new ApiResponse(200, playlists, "these are your playlists")
    )
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId)
        .populate("videos");//shows content of videos(like title description) not just video id

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // Check playlist ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot modify someone else's playlist");
    }
    // Check whether video already exists
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist");
    }
    // Add video to playlist
    playlist.videos.push(videoId);

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // Check playlist ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot modify someone else's playlist");
    }

    const exists = playlist.videos.some(
        id => id.toString() === videoId
    )
    if (!exists) {
        throw new ApiError(404, "Video not found in playlist");
    }
    // Add video to playlist
    playlist.videos.pull(videoId);
    await playlist.save();
    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    // Check playlist ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete someone else's playlist");
    }
    const deleted=await Playlist.findByIdAndDelete(playlistId)
    return res.status(200).json(
        new ApiResponse(200, deleted, " Playlist deleted successfully")
    ) 
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if (!(name || description)) {
        throw new ApiError(400, "Name or description is required");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    // Check playlist ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete someone else's playlist");
    }
    const updated=await Playlist.findByIdAndUpdate(
        playlistId,
        {$set:{
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description })
        }
        },
        { new: true, runValidators: true }
    )
    return res.status(200).json(
        new ApiResponse(200, updated, " Playlist updated successfully")
    )   
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}