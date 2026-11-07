import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const{content}=req.body
    if(!content){
        throw new ApiError(404,"content not found")  
    }
    const tweet=await Tweet.create(
        {
            content,
            owner:req.user._id
        }
    )
    res.status(201).json(new ApiResponse(201,tweet,"Tweet has been created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const{userId}=req.params
    const tweets=await Tweet.find({owner:userId}).select("content")
    res.status(200).json(new ApiResponse(200,tweets,"These are your tweets"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")  
    }
    
    const{content}=req.body
    if(!content){
        throw new ApiError(404,"content not found")  
    }

    // Check tweet ownership
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot update someone else's tweet");
    }

    const updated=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content
            }
        },
        { new: true, runValidators: true }
    )
    res.status(200).json(new ApiResponse(200,updated,"Tweet has been updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
        const { tweetId } = req.params;
        // Check whether comment exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            throw new ApiError(404, "tweet not found");
        }
        // Check comment ownership
        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You cannot delete someone else's tweet");
        }
        // delete tweet
        const deleted = await Tweet.findByIdAndDelete(tweetId)
        return res.status(200).json(
            new ApiResponse(200, deleted, "Tweet deleted successfully")
        );  
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}