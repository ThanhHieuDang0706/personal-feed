import User from "../models/User.js";

// -------------------------  GET USER  ---------------------
/** 
 * @route   GET /users/:id
 * @desc    Get user by id
 * @access  Private
 * */ 

export const getUser = async (req, res) => {
    try {
        const {id} = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}


// -------------------------  GET USER FRIENDS  ---------------------
/**
 * @route   GET /users/:id/friends
 * @desc    Get user friends by that belongs to the user id
 * @access  Private
 */
export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params.id;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((friendId) => User.findById(friendId))
        );
        const formattedFriends = friends.map(friend =>  (
            {
                _id: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                occupation: friend.occupation,
                location: friend.location,
                picturePath: friend.picturePath,
            }
        ));
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
}

// --------------------------- UPDATE USER FRIEND ------------------
/** 
 * @route   PATCH /users/:id/:friendId
 * @desc    Add or remove friend from user
 * @access  Private
 * */ 
export const addRemoveFriend = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
    
        if (user.friends.includes(friendId)) {
            // remove the relationship of the user and the friend
            user.friends = user.friends.filter(fId => fId !== friendId);
            friend.friends = friend.friends.filter(fId => fId !== id);
        }
        else 
        {
            // add the relationship of the user and the friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        // return new friend lists
        const friends = await Promise.all(
            user.friends.map((friendId) => User.findById(friendId))
        );
        const formattedFriends = friends.map(friend =>  (
            {
                _id: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                occupation: friend.occupation,
                location: friend.location,
                picturePath: friend.picturePath,
            }
        ));

        res.status(200).json(formattedFriends);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
}