const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { jwtVerify } = require("jose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const createUser = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName, job } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        firstName,
        lastName,
        job,
        password: hashedPassword,
      },
    });
    res.send({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send({ users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ message: "Error retrieving users" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.SECRET_KEY, // Replace process.env.SECRET_KEY with your actual secret key
        {
          expiresIn: "24h",
        },
        (err, token) => {
          if (err) {
            res.status(500).send({ message: "Error logging in" });
            console.error("Error logging in:", err);
          }
          res.cookie("accessToken", token).json("ok");
        }
      );
    } else {
      res.status(400).send({ message: "Invalid credentials" });
      console.log("Invalid credentials:", email, password);
    }
    res;
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ message: "Error logging in" });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    // Create a JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.SECRET_KEY, // Replace process.env.SECRET_KEY with your actual secret key
      { expiresIn: "24h" }
    );
    res.send({
      message: "User created successfully",
      //newUser,
      data: token,
    });
    console.log("User created successfully:", newUser, token);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user" });
  }
};

const get = async (req, res) => {
  try {
    // Extract the token from the Authorization header

    const token = req.cookies.accessToken;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId, // Assuming the payload contains the userId
      },
    });

    if (user) {
      // Assuming `user.picture` is the filename
      if (user.pfp) {
        // Construct the full URL to the picture
        const pfpUrl = `${req.protocol}://${req.get("host")}/uploads/${
          user.pfp
        }`;
        user.pfp = pfpUrl;
      }

      res.status(200).send(user);
      console.log(user);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    // Handle errors, including token verification errors
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const getUser = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const userId = req.params.id;
    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // Assuming the payload contains the userId
      },
    });

    if (user) {
      // Assuming `user.picture` is the filename
      if (user.pfp) {
        // Construct the full URL to the picture
        const pfpUrl = `${req.protocol}://${req.get("host")}/uploads/${
          user.pfp
        }`;
        user.pfp = pfpUrl;
      }

      res.status(200).send(user);
      console.log(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle errors, including token verification errors
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).send({ message: "Access token missing" });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Log request body


    // Access the uploaded file
    const pfp = req.file ? req.file.filename : user.pfp;

    // Parse userDetails from request body
    const userDetails = JSON.parse(req.body.userDetails);

    // Exclude totalComments and totalBlogs from userDetails
    const {
      totalComments: _,
      totalBlogs: __,
      ...restUserDetails
    } = userDetails;

    const totalComments = await prisma.comment.count({
      where: {
        authorId: payload.userId,
      },
    });

    const totalBlogs = await prisma.blog.count({
      where: {
        authorId: payload.userId,
      },
    });

    let updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ...restUserDetails,
        totalBlogs,
        totalComments,
        pfp: pfp,
      },
    });
    updatedUser = { ...updatedUser, totalComments, totalBlogs };

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .send({ message: "Error updating user", error: error.message });
  }
};

const resetPfp = async (req, res) => {
  try {
    const userId = "clybephju0000jvk6y4cdz4c0";

    // Check if the user exists

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        pfp: null,
      },
    });

    res.status(200).send({
      message: "Profile picture reset successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error resetting profile picture:", error);
    res.status(500).send({ message: "Error resetting profile picture" });
  }
};
const recentBlogs = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId, // Assuming the payload contains the userId
      },
    });
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    const newBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const user = await prisma.user.findUnique({
          where: {
            id: blog.authorId,
          },
          select: {
            name: true,
            firstName: true,
            lastName: true,
            pfp: true,
          },
        });

        const comments = await prisma.comment.count({
          where: {
            blogId: blog.id,
          },
        });

        const pfp = `${req.protocol}://${req.get("host")}/uploads/${user.pfp}`;
        return { ...blog, author: { ...user, pfp: pfp }, comments };
      })
    );
    res.send({ blogs: newBlogs });
  } catch (error) {
    console.error("Error retrieving recent blogs:", error);
    res.status(500).send({ message: "Error retrieving recent blogs" });
  }
};

const blogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const page = parseInt(req.query.page) || 1; // Page number from query, default to 1
    const take = 5; // Number of items per page
    const skip = (page - 1) * take; // Calculate skip

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      skip: skip,
      take: take,
    });
    const newBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const user = await prisma.user.findUnique({
          where: {
            id: blog.authorId,
          },
          select: {
            name: true,
            firstName: true,
            lastName: true,
            pfp: true,
          },
        });
        const pfp = `${req.protocol}://${req.get("host")}/uploads/${user.pfp}`;
        return { ...blog, author: { ...user, pfp: pfp } };
      })
    );

    const blogNum = await prisma.blog.count({
      where: {
        authorId: userId,
      },
    });
    res.send({
      blogs: newBlogs,
      totalPages: Math.max(0, Math.ceil(blogNum / take) - (page + 1) + 2),
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).send({ message: "Error retrieving blogs" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    /* const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        } */

    // Generate a unique hex code
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Store the reset token in the database (example schema)
    // You might need to adjust this according to your database schema
    await prisma.passwordReset.create({
      data: {
        email: req.body.email,
        token: resetToken,
      },
    });

    // Send an email to the user with the reset token
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    let mailOptions = {
      from: `zako ✔ <${process.env.MY_EMAIL}>`,
      to: email,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please use the following token to reset your password:\n\n` +
        `${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
          message: "Error sending password reset email",
          token: resetToken,
        });
      } else {
        console.log("Email sent: " + info.response);
        res.send({ message: "Password reset link sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    res.status(500).send({ message: "Error sending password reset link" });
  }
};

module.exports = {
  createUser,
  getUsers,
  loginUser,
  authenticateToken,
  signupUser,
  get,
  updateUser,
  resetPfp,
  recentBlogs,
  getUser,
  blogs,
  forgotPassword,
};
