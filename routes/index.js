const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
// use code below to hash a new user's password
// user.password = bcryptjs.hashSync(user.password);
// const auth = require('basic-auth');
const db = require('../models');
const { User } = db.models;
const { Course } = db.models;

// authentication middleware
// const authenticateUser = (req, res, next) => {
//   let message = null;

//   // Parse the user's credentials from the Authorization header.
//   const credentials = auth(req);

//   // If the user's credentials are available...
//   if (credentials) {
//     // Attempt to retrieve the user from the data store by their username (i.e. the user's "key" from the Authorization header).
//     const user = users.find(u => u.username === credentials.name);

//     // If a user was successfully retrieved from the data store...
//     if (user) {
//       // Use the bcryptjs npm package to compare the user's password (from the Authorization header) to the user's password that was retrieved from the data store.
//       const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

//       // If the passwords match...
//       if (authenticated) {
//         console.log(`Authentication successful for username: ${user.username}`);

//         // Then store the retrieved user object on the request object so any middleware functions that follow this middleware function will have access to the user's information.
//         req.currentUser = user;
//       } else {
//         message = `Authentication failure for username: ${user.username}`;
//       }
//     } else {
//       message = `User not found for username: ${credentials.name}`;
//     }
//   } else {
//     message = 'Auth header not found';
//   }

//   // If user authentication failed...
//   if (message) {
//     console.warn(message);

//     // Return a response with a 401 Unauthorized HTTP status code.
//     res.status(401).json({ message: 'Access Denied' });
//   } else {
//     // Or if user authentication succeeded...
//     // Call the next() method.
//     next();
//   }
// };

const asyncHandler = cb => (
    async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);

readUser = require('./user/read-user')(router, asyncHandler, db, User, bcryptjs);
createUser = require('./user/create-user')(router, asyncHandler, db, User, bcryptjs);
readCourses = require('./course/read-courses')(router, asyncHandler, db, Course);
readCourse = require('./course/read-course')(router, asyncHandler, db, Course);
createCourse = require('./course/create-course')(router, asyncHandler, db, Course);
updateCourse = require('./course/update-course')(router, asyncHandler, db, Course);
deleteCourse = require('./course/delete-course')(router, asyncHandler, db, Course);

router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
}));

module.exports = router;