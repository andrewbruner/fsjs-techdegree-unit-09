const updateCourse = (router, authenticateUser, asyncHandler, Course) => {
    router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
        try {
            // find current course for reference
            const course = await Course.findOne({
                where: {
                    id: req.params.id
                }
            });
            // test if currentUser owns current course
            if (req.currentUser.id !== course.userId) {
                // if not, throw error
                const error = new Error('Access Denied: Only course owner may update course.');
		error.name = 'AccessError';
		throw error;
            }
	    // test if body.title and body.description are present
	    // (Sequelize validation would allow an empty request body on this PUT route otherwise)
		if (!req.body.title) {
		    const error = new Error('Please enter a valid title.');
		    error.name = 'NullError';
		    throw error;
		}
		if (!req.body.description) {
		    const error = new Error('Please enter a valid description.');
		    error.name = 'NullError';
		    throw error;
		}
            // update current course
            await Course.update(req.body, {
                where: { 
                    id: req.params.id
                }
            });
            res.status(204).end();
        } catch (err) {
	    const message = [];
	    // if access error, log specific message
	    if (err.name === 'AccessError') {
	      message.push(err.message);
              console.error('Access Error: ', message);
	      return res.status(403).json({ message: message });
	    }
	    // if null error, log specific message
	    if (err.name === 'NullError') {
	      message.push(err.message);
	      console.error('Validation Error: ', message);
	      return res.status(400).json({ message: message });
	    }
            // on other error(s), log validation message(s)
            err.errors.forEach(error => message.push(error.message));
	    console.error('Validation Error: ', message);
	    res.status(400).json({ message: message });
        }
    }));
};

module.exports = updateCourse;
