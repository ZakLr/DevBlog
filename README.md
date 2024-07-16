<p align='center'>
  <a href='' rel='noopener'>
    <img width=200px height=200px src='https://i.imgur.com/6wj0hh6.jpg' alt='Project logo'>
  </a>
</p>

<h3 align='center'>DevBlog</h3>

<div align='center'>

  [![Status](https://img.shields.io/badge/status-active-success.svg)]()
  [![GitHub Issues](https://img.shields.io/github/issues/ZakLr/The-Documentation-Compendium.svg)](https://github.com/ZakLr/The-Documentation-Compendium/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/ZakLr/The-Documentation-Compendium.svg)](https://github.com/ZakLr/The-Documentation-Compendium/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

## 📝 Table of Contents
- [About](#about)
- [Built Using](#built_using)
- [Getting Started](#getting_started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running_the_application)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Authors](#authors)

## 🧐 About <a name='about'></a>
DevBlog is a platform I built that helps developers post their blogs or write-ups easily using markdown with a clean UI.

## ⛏️ Built Using <a name='built_using'></a>
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Node.js](https://nodejs.org/) - Server Environment
- [Express.js](https://expressjs.com/) - Server Framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - Database Toolkit

## 🏁 Getting Started <a name='getting_started'></a>
The application is a full-stack one, so you need to run the server and the interface both at once (the server will be on port 3000 and the interface will be on port 3001). Let's start running this application.

### Prerequisites
Let's start with the server-side. As mentioned before, the application is made with Node.js and PostgreSQL, so you need to install them first on your local machine. YouTube has many videos explaining how to install them.

### Installation
Now that you have them installed on your machine, let's start:
1. Clone the project:
Run the following command in a new folder in your terminal:
```bash
git clone "https://github.com/ZakLr/DevBlog"
```
2. Install the dependencies:
We will need to install the dependencies of the frontend and the backend.
Navigate to the backend folder on your terminal using the command:
```bash
cd .backend
```
Then run the following command:
```bash
npm i
```
Let's do the same thing with the frontend, run the command:
```bash
cd ../frontend
```
Then run the following command:
```bash
npm i
```

## 🔧 Running the Application <a name='running_the_application'></a>
Now we have everything installed, let's configure some stuff in the backend. You need to create some environment variables so our backend works correctly. Navigate to the backend folder/directory and create a file named '.env'. Paste the following text in it:
```bash
DATABASE_URL=
SECRET_KEY=
MY_EMAIL=
MY_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
```
You need to fill these fields in order to make the backend work:
### Quick Explanation of Them:
- The 'DATABASE_URL' is the link to your PostgreSQL database
- The 'SECRET_KEY' is just a random string (used for JWT)
- The other fields are for the password recovery service. You can visit [Mailtrap](https://mailtrap.io/) to see more about how to obtain them.

Everything is set up now, let's run the app:
1. Navigate to the backend and run the command
'npm start'
2. Navigate to the frontend and run:
'npm run dev'
Go to your browser and visit: 'http://localhost:3001' and sign yourself up!

## 🎈 Usage <a name='usage'></a>
Just sign up, then you can start playing around with the application and discover it.

## 📸 Screenshots <a name='screenshots'></a>
(Add some screenshots here to showcase your application)
<div align='center'>
  <img src='path/to/screenshot1.png' alt='Screenshot 1' width='400px'>
  <p><em>Dashboard view</em></p>
</div>

<div align='center'>
  <img src='path/to/screenshot2.png' alt='Screenshot 2' width='400px'>
  <p><em>Post editor</em></p>
</div>

## ✍️ Authors <a name='authors'></a>
- [@ZakLr](https://github.com/ZakLr) - Idea & Work


