import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bannerImg: {
        type: String,
        default: ""
    },
    headline: {
        // the role 
        type: String,
        default: "linkedin user"
    },
    location: {
        type: String,
        default: "Earth"
    },
    about: {
        type: String,
        default: ""
    },
    skills: [String],
    experience: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String
        },
    ],
    education: [
        {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
        },
    ],
    connection: [{
        type: mongoose.Schema.Types.ObjectId, ref:"User"
}]
    
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User