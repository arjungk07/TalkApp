import User from "../models/User.js";

export const uploadProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // check file
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // build image URL
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true }
    );

    console.log("uploadController.js / 24", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated",
      imageUrl,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
