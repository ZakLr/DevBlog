const express = require('express');
const app = express();
const cors = require('cors');
  

const path = require('path')
const port = 3000;
require('dotenv').config();

const UPLOADS_DIR = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3001'
}));
app.use(express.json());

//routes
const blogRouter = require('./routes/blog.router');
app.use('/api/blog', blogRouter);   

const userRouter = require('./routes/user.router');
app.use('/api/user', userRouter);

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});