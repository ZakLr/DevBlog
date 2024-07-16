const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { jwtVerify } = require("jose");

const validTopics = [
  "Python",
  "JavaScript",
  "Java",
  "C",
  "Cpp",
  "CSharp",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "TypeScript",
  "HTML",
  "CSS",
  "SQL",
  "NoSQL",
  "GraphQL",
  "REST",
  "WebDev",
  "MobileDev",
  "GameDev",
  "AI",
  "ML",
  "DL",
  "IoT",
  "Cloud",
  "DevOps",
  "Testing",
  "Security",
  "Blockchain",
  "DataScience",
  "Other",
];

// Function to get all blog Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.send({ blogs });
  } catch (error) {
    console.error("Error retrieving blog Blogs:", error);
    throw error;
  }
};

const getFeed = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).send({ message: "Access token is required" });
    }

    const { payload } = await jwtVerify(token,new TextEncoder().encode(process.env.SECRET_KEY));
    const page = parseInt(req.query.page) || 1; // Page number from query, default to 1
    const take = 5; // Number of items per page
    const skip = (page - 1) * take; // Calculate skip



    const blogs = await prisma.blog.findMany({
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const blogNum = await prisma.blog.count();

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    }

    const blogsPromises = blogs.map(async (blog) => {
      const user = await prisma.user.findUnique({
        where: {
          id: blog.authorId,
        },
        select: {
          name: true,
          pfp: true,
          email: true,
        },
      });
      const pfp = `${req.protocol}://${req.get("host")}/uploads/${user.pfp}`;
      return { ...blog, author: { name: user.name, pfp, email: user.email } };
    });
    
    // Wait for all promises to resolve
    const blogsWithAuthors = await Promise.all(blogsPromises);
    
    // Now you can shuffle and send the response
    shuffleArray(blogsWithAuthors);
    
    res.send({
      blogs: blogsWithAuthors,
      totalPages: Math.max(0, Math.ceil(blogNum / take) - (page + 1) + 2),
    });
    
  } catch (error) {
    console.error("Error fetching user feed:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the feed" });
  }
};

const createBlog = async (req, res) => {
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

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    
    const newBlog = await prisma.blog.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        picture, 
        author: {
          connect: {
            id: payload.userId,
          },
        },
      },
    });
    console.log("new blog:", newBlog);
    res.status(201).send(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send({ message: "Error creating blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
};

const likeBlog = async (req, res) => {
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

    if (!user.blogsLiked.includes(req.params.blogId)) {
      await prisma.blog.update({
        where: {
          id: req.params.blogId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      await prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          blogsLiked: {
            push: req.params.blogId,
          },
        },
      });
      console.log("blog liked successfully");
    }
    res.status(200).send({ message: "Blog liked successfully" });
  } catch (error) {
    console.error("Error liking comment:", error);
  }
};

const unlikeBlog = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    // Find the user and check if the blogId is in their blogsLiked
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        blogsLiked: true,
      },
    });

    if (user && user.blogsLiked.includes(req.params.blogId)) {
      // Decrement the likes count of the blog
      await prisma.blog.update({
        where: {
          id: req.params.blogId,
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      // Remove the blogId from the user's blogsLiked array
      const updatedBlogsLiked = user.blogsLiked.filter(
        (blogId) => blogId !== req.params.blogId
      );
      await prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          blogsLiked: {
            set: updatedBlogsLiked,
          },
        },
      });

      console.log("Blog unliked successfully");
      res.send({ message: "Blog unliked successfully" });
    } else {
      console.log("Blog not found in user's liked blogs");
      res.status(404).send({ message: "Blog not found in user's liked blogs" });
    }
  } catch (error) {
    console.error("Error unliking blog:", error);
    res.status(500).send({ message: "Error unliking blog" });
  }
};

const addComment = async (req, res) => {
  try {
    const { content, userId } = req.body;

    // Check if the author exists
    const author = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    // Check if the blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: req.params.blogId },
    });

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    // Create the new comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        blogId: req.params.blogId,
      },
    });

    res.send({ message: "Comment created successfully", data: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const likeComment = async (req, res) => {
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

    if (!user.commentsLiked.includes(req.params.blogId)) {
      await prisma.comment.update({
        where: {
          id: req.params.blogId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      await prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          commentsLiked: {
            push: req.params.blogId,
          },
        },
      });
      console.log("Comment liked successfully");
    }
  } catch (error) {
    console.error("Error liking comment:", error);
  }
};
const unlikeComment = async (req, res) => {
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
    if (user.commentsLiked.includes(req.params.blogId)) {
      await prisma.comment.update({
        where: {
          id: req.params.blogId,
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      res.send({ message: "Comment unliked successfully" });
    }
  } catch (error) {
    console.error("Error liking comment:", error);
  }
};

const updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { title, content } = req.body;
  const picture = req.file ? req.file.filename : null; // Get the uploaded file

  try {
    // Update the blog in the database
    await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        content,
        picture, // Store file path or filename in the database
      },
    });

    // Fetch the updated blog
    const newBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    res.status(200).json(newBlog); // Respond with the updated blog
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" }); // Send error response
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (blog) {
      // Assuming `blog.picture` is the filename
      if (blog.picture) {
        // Construct the full URL to the picture
        const pictureUrl = `${req.protocol}://${req.get("host")}/uploads/${
          blog.picture
        }`;
        blog.pictureUrl = pictureUrl; // Add picture URL to the response
      }
      blog.author = await prisma.user.findUnique({
        where: {
          id: blog.authorId
        },
        select: {
          name: true,
          pfp: true,
          firstName: true,
          lastName: true
        }
      })

      blog.createdAt = blog.createdAt.toISOString();

      res.status(200).json({ blog });
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ error: "Failed to get blog" });
  }
};

const getComments = async (req, res) => {
  try {
    // Fetch comments for the given blogId
    const comments = await prisma.comment.findMany({
      where: { blogId: req.params.blogId },
    });

    // Fetch author details for each comment
    const newComments = await Promise.all(
      comments.map(async (comment) => {
        const author = await prisma.user.findUnique({
          where: { id: comment.authorId },
          select: { email: true, pfp: true, name:true, firstName:true, lastName:true }, // Fetch only name and profile picture
        });
        const pfp = `${req.protocol}://${req.get("host")}/uploads/${author.pfp}`;
        return {
          ...comment,
          author:{...author, pfp:pfp},
        };
      })
    );

    // Send the comments along with their author details
    res.send({ comments: newComments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).send({ error: "Error fetching comments" }); // Send a proper error response
  }
};

const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    await prisma.comment.update({
      where: {
        id: req.params.id,
      },
      data: {
        content,
      },
    });
    res.send({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

const deleteComment = async (req, res) => {
  try {
    await prisma.comment.delete({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

const getRecentBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const newBlogs = await Promise.all(blogs.map(async (blog) => {
      const user = await prisma.user.findUnique({
        where: {
          id:blog.authorId
        },
        select:{
          name: true,
          firstName: true,
          lastName: true,
          pfp:true
        }
      })

      const pfp = `${req.protocol}://${req.get("host")}/uploads/${user.pfp}`;
      return {...blog, author:{...user, pfp:pfp}}
    }))
    res.send({ blogs:newBlogs });
  } catch (error) {
    console.error("Error getting recent blogs:", error);
  }
};

const getPopularBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        likes: "desc",
      },
      take: 5,
    });
    res.send({ blogs });
  } catch (error) {
    console.error("Error getting popular blogs:", error);
  }
};

const getBlogByUser = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: req.params.id,
      },
    });
    res.send({ blogs });
  } catch (error) {
    console.error("Error getting blogs by user:", error);
  }
};

const deleteAll = async (req, res) => {
  await prisma.comment.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  res.send({ message: "All blogs and comments deleted successfully" });
};

const reportBlog = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newReport = await prisma.report.create({
      data: {
        content,
        blogId: req.params.id,
        authorId: userId,
      },
    });
    res.send({ message: "Blog reported successfully" });
  } catch (error) {
    console.error("Error reporting blog:", error);
  }
};

const reportComment = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newReport = await prisma.report.create({
      data: {
        content,
        commentId: req.params.id,
        authorId: userId,
      },
    });
    res.send({ message: "Comment reported successfully" });
  } catch (error) {
    console.error("Error reporting comment:", error);
  }
};

const reportUser = async (req, res) => {
  try {
    const { reporter, reported, content } = req.body;
    const newReport = await prisma.report.create({
      data: {
        content,
        authorId: reporter,
        reportedUserId: reported,
      },
    });
    await prisma.user.update({
      where: {
        id: reporter,
      },
      data: {
        reports: {
          push: newReport,
        },
      },
    });

    res.send({ message: "User reported successfully" });
  } catch (error) {
    console.error("Error reporting user:", error);
  }
};

const sidebarStuff = async (req, res) => {
  try {
    const recentBlogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    /* const trendingCategories = await prisma.blog.findMany({
      orderBy: {
        likes: 'desc',
        comments: {
          _count:'desc'
        }
      },
      take: 4,
      select: {
        topics:true
      }
    }) */

    const trendingCategories = ["Python", "JavaScript", "AI", "WebDev"];

    res.send({ recentBlogs, trendingCategories });
  } catch (error) {}
};

const search = async (req, res) => {
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

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const searchQuery = req.query.search;
    const searchedUser = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: searchQuery, mode: "insensitive" } },
          { lastName: { contains: searchQuery, mode: "insensitive" } },
          { name: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: {
        firstName: true,
        lastName: true,
        pfp: true,
        name: true,
        job: true,
        id: true,
      },
    });
    const searchedBlog = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { subtitle: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      take: 3,
    });

    if (searchedUser) {
      searchedUser.map((user) => {
        user.pfp = `${req.protocol}://${req.get("host")}/uploads/${user.pfp}`;
      });
    }

    // Combine user and blog results
    const result = {
      users: searchedUser,
      blogs: searchedBlog,
    };

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  likeComment,
  unlikeComment,
  updateBlog,
  getBlog,
  editComment,
  deleteComment,
  getRecentBlogs,
  getPopularBlogs,
  getBlogByUser,
  deleteAll,
  reportBlog,
  reportComment,
  reportUser,
  getFeed,
  getComments,
  sidebarStuff,
  search,
};
