import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: req.user.connections },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture ")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    //check if  the current is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "you are not authorized to delete this post " });
    }

    if (post.image) {
      //todo: do this later
      //https://res.cloudinary.com/doqh2phxg/image/upload/v1730533674/cld-sample-5.jpg
    }

    await Post.findByIdAndUpdate(postId);

    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.log("Error in deleting post controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
