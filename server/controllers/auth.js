import bcrypt from 'bcrypt';
import User from '../models/user.js';

/* ------------------ REGISTER ------------------ */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, location, occupation, friends, picturePath } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName, lastName, email, password: hashedPassword, location, occupation, friends, picturePath,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }
};
