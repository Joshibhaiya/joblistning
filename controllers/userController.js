import userModel from "../models/userModel.js"

export const updateUserController = async (req,res)=>{
    const {username, email, lastname, location} = req.body
    if (!username || !email || !lastname || !location   ){
        next("pleasr provide all fileds")
    }
    const user = await userModel.findOne({_id: req.user.userId})
    user.username = username
    user.lastname = lastname
    user.email = email
    user.location = location

    await user.save();
    const token = user.createJWT();
    res.status(200).json({
        user,
        token,
    });

}


export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await userModel.find({});
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next("Failed to fetch users");
    }
};


export const getUserByIdController = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next("Failed to fetch user");
    }
};

