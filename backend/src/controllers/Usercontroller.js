import User from "../Models/User.model.js";
import generatetoken from "../utils/generatetoken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// register
const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, mobile, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with email or username" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // const user = await User.create(req.body)
    const user = await User.create({
      fullname,
      username,
      email: email.toLowerCase(),
      mobile,
      password: hashedpassword,
      role: "user",
    });

    console.log("User Role = ", user.role);
    console.log(user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // typed password != stored password
    const ispasswordmatch = await bcrypt.compare(password, user.password);
    if (!ispasswordmatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwttoken = generatetoken(user);

    res.cookie("token", jwttoken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: "Login successful",
      user,
    });

    // res.json({
    //   message: "Login successful",
    //   jwttoken,
    //   user
    // });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// about page
const aboutPage = (req, res) => {
  res.send("About Page");
};

// logout page
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

const checkAuthentication = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Authenticated",
      userId: decoded.id,
      role: decoded.role,
      name: decoded.name
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid jwt token" });
  }
};

const addAdress = async (req, res) => {
  const userId = req.user.id;
  const { name, address, pincode, phone, additionalInfo } = req.body;
  console.log(req.body)
  try {
    if (!name || !address || !pincode || !phone) {
      return res.status(400).json({ message: "All required fields needed" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.addresses.length >= 5) {
      return res.status(400).json({ message: "Maximum 5 addresses allowed" });
    }
    user.addresses.unshift({
      name,
      address,
      pincode,
      phone,
      additionalInfo,
    });

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });


  }
  catch (error) {
    res.status.json({ message: "server error" })
  }


}

const editAdress = async (req, res) => {
  const userId = req.user.id;
  const { index } = req.params;
  const { name, address, pincode, phone, additionalInfo } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[index] = {
      name,
      address,
      pincode,
      phone,
      additionalInfo,
    };

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });


  }
  catch (error) {
    res.status(500).json({ message: "Server Error" })
  }

}

const deleteAdress = async (req, res) => {
  const userId = req.user.id;
  const { index } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    if (!user.addresses[index]) {
      res.status(400).json({ message: "adresses not found" })
    }
    user.addresses.splice(index, 1);

    await user.save();

    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });

  }
  catch (error) {
    res.status(500).json({ message: "server Error" })
  }

}

const getAdress = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ message: "User Not Found" })
    }
    res.status(200).json({
      addresses: user.addresses,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" })
  }

}

export {
  registerUser,
  loginUser,
  aboutPage,
  logoutUser,
  getAllUsers,
  checkAuthentication,
  addAdress,
  editAdress,
  deleteAdress,
  getAdress
};
