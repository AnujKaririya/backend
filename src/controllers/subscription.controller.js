import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const {enabled} = req.body
    const user=req.user
    //toogle on
    if(enabled=="true"){
        try{
        const subs=await Subscription.create({
            subscriber:user._id,
            channel:channelId
        })

        return res.status(200)
        .json(
                new ApiResponse(
                    200, 
                    {},
                    "you are subscribe to this channel Successfully"
                )
            )
    }
    catch{
        console.log("error in subscription",error)
    }
}
    //toogle off
    else{
        const channel=await Subscription.findOneAndDelete({
            subscriber: user._id,
            channel: channelId,
            });
        if(!channel){
        throw new ApiError(401,"problem in channel unsupscription")
        }

        return res.status(200)
        .json(
                new ApiResponse(
                    200, 
                    {},
                    "you are unsubscribed Successfully"
                )
            )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    console.log(channelId)
    console.log("started")
    
    try {
        const allSubscriptions = await Subscription.find({});

console.log("All subscriptions:", allSubscriptions);

console.log("Total subscriptions:",
    await Subscription.countDocuments()
);
        const IdList=await Subscription.find({channel:channelId}).select("subscriber")
        console.log("Subscriptions fetched:", IdList.length);
        const usernameList=[]
        for (const item of IdList) {
        const userName=await User.findById(item.subscriber).select("username")
        if(userName){
            usernameList.push(userName.username)
            } 
        }
        res.status(200)
        .json(
                    new ApiResponse(
                        200, 
                        {usernameList},
                        "these are subscribers"
                    )
                )
    } catch (error) {
        console.log(error)
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    console.log(subscriberId)
    console.log("started")
        try{
        const IdList=await Subscription.find({subscriber:subscriberId}).select("channel")
        console.log("Channels fetched:", IdList.length);
        const usernameList=[]
        for (const item of IdList) {
        const userName=await User.findById(item.channel).select("username")
        if(userName){
            usernameList.push(userName.username)
            } 
        }
        res.status(200)
        .json(
                    new ApiResponse(
                        200, 
                        {usernameList},
                        "these are channels"
                    )
                )
    } catch (error) {
        console.log(error)
    }
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}