const Profile = require("../models/Profile.model");
const User = require("../models/User.model");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const {dateOfBirth="", about="", contactNumber, gender} = req.body;

    // get userId
    const id = req.user.id;

    // validation
    if(!contactNumber || !gender || !id){
      return res.status(400).json({
        success: false,
        message: "Please fill out the required fields",
      });
    }

    // find the profile
    const userDetails = await User.findOne({_id: id});
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById({_id: profileId});

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contact = contactNumber;
    await profileDetails.save();

    // return response
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profileDetails,
      });

  } 
  catch (error) {
    console.log("Error while updating the userProfile\n", error);
      return res.status(500).json({
        success: false,
        message: "Failed to updateProfile",
        error: error.message,
      });
  }
}

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);
    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete userProfile
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    // delete user
    await User.findByIdAndDelete({_id: id});

    // return response
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    })

  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete the account at the moment, please try again later",
    });
  }
}

// userDetails
exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;    

    // validation and get user details
    const userDetails = await User.findById({_id : id}).populate("additionalDetails").exec();
    
    // return response
    return res.status(200).json({
      success: true,
      message: "fetched user details",
      data: userDetails,
    });

  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to get user details",
      error: error.message,
    });
  }
}