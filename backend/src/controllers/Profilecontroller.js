import user from "../Models/User.model.js";
import profile from "../Models/profile.model.js";

const postpersonalprofile = async (req, res) => {
  const { coverImage, age, bio, sociallinks } = req.body;
  try {
    const personalinfo = await profile.create({
      user: req.user.id,
      coverImage,
      age,
      bio,
      sociallinks,
    });

    res.status(200).json(personalinfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getmyprofile = async (req, res) => {
  try {
    const userinfo = await user
      .findById(req.user.id)
      .select("username fullname email mobile");

    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    const userprofile = await profile.findOne({ user: req.user.id });

    res.status(200).json({
      user: userinfo,
      profile: userprofile || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updatemyprofile = async (req, res) => {
//     const { coverImage, age, bio, sociallinks, fullname } = req.body;
//     try {
//         const updatedProfile = await profile.findOneAndUpdate(
//             { user: req.user },
//             { coverImage, age, bio, sociallinks },
//             { new: true }
//         );
//         const updatedUser = await user.findByIdAndUpdate(
//             req.user,
//             { fullname },
//             { new: true }
//         );

//         res.status(200).json({
//             user: updatedUser,
//             profile: updatedProfile
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const updatemyprofile = async (req, res) => {
  const { coverImage, age, bio, sociallinks, fullname } = req.body;

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Build profile update only with provided fields
    const profileUpdate = {};
    if (coverImage !== undefined) profileUpdate.coverImage = coverImage;
    if (age !== undefined) profileUpdate.age = age;
    if (bio !== undefined) profileUpdate.bio = bio;
    if (sociallinks !== undefined) profileUpdate.sociallinks = sociallinks;

    let updatedProfile = null;
    if (Object.keys(profileUpdate).length > 0) {
      updatedProfile = await profile.findOneAndUpdate(
        { user: userId },
        { $set: profileUpdate },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      updatedProfile = await profile.findOne({ user: userId });
    }

    let updatedUser = null;
    if (fullname !== undefined) {
      updatedUser = await user
        .findByIdAndUpdate(
          userId,
          { fullname },
          { new: true, runValidators: true }
        )
        .select("username fullname email mobile");
    } else {
      updatedUser = await user
        .findById(userId)
        .select("username fullname email mobile");
    }

    return res.status(200).json({
      user: updatedUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("updatemyprofile error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export { postpersonalprofile, getmyprofile, updatemyprofile };

// const getmyprofile = async (req, res) => {
//     try {
//         const userprofile = await profile
//           .findOne({ user: req.user })
//           .populate("user", "username fullname email mobile");
//         res.status(200).json(userprofile);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
