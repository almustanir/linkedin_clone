import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js"

export const getSuggestedConnections = async (req, res) => {

    try {
        const currentUser = await User.findOneById(req.user._id).select("connections");

        //find users who are not connected,and also do not recommend our own profile
        const suggestedUser = await User.find({
            _id:{
                $me:req.user._id, $nin: currentUser.connections
            }
        }).selection("name username profilePicture headline").limit(3);

        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in suggestedConnections controller:", error);
        res.status(500).json({message: "internal server error"});
        
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select( "-password" );
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
            "password"
        ];
        const updatedData = {};
            //name mubarak olajide 
        for(const field of allowedFields){
            if(req.body[field]){
                updatedData[field] = req.body[field];
            }
        }

        //todo check for the profile image and banner image uploaded to cloudinary
        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updatedData.profilePicture = result.secure_url;
        }
        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updatedData.bannerImg = result.secure_url;
        }

        const user = await User.findOneAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");

        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controlller:", error);
        res.status(500).json({message: "server error"});
    }
}