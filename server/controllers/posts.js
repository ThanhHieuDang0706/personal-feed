import Post from '../models/Post.js';
import User from '../models/User.js';

// ------------------------- CREATE ---------------------
/**
 * @route   POST /posts
 * @desc    Create a post
 * @access  Private
 */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            // likes = { "SomeId" : true}
            likes: {},
            comments: []
        });
        await newPost.save();

        // get all posts and send to client
        const posts = await Post.find();
        res.status(201).json(posts);
    } catch (err) {
        console.error(err);
        res.status(409).json({ message: err.message });
    }
};

// --------------------- READ ---------------------
/**
 * @route   GET /posts
 * @desc    Get all posts
 * @access  Private
 */

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
};

/**
 * @route   GET /posts/:userId/posts
 * @desc    Get all posts for a user
 * @access  Private
 */
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
};

// --------------------- UPDATE ---------------------
/**
 * @route  PATCH /posts/:id/like
 * @desc   Like a post
 * @access Private
 */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
};
