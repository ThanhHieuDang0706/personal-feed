import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
/* ------------------ REGISTER ------------------ */
/**
 * @route /auth/register
 * @desc Register user
 * @access Public
 */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, location, occupation, friends, picturePath } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            location,
            occupation,
            friends,
            picturePath,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// --------------------- LOGIN ---------------------
/**
 *
 * @param {*} req
 * @param {*} res
 * @route /auth/login
 * @desc Login user
 * @access Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ error: 'Invalid credentials!' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
