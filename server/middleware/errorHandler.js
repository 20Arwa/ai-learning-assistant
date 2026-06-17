const errorHandler = (err, req, res, next) => {
    let message = err.message || 'Server Error';
    let statusCode = err.statusCode || 500;

    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }

    if (err.code === 11000 && err.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors)
        .map(val => val.message)
        .join(', ');
        statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
        statusCode = 401;
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File too large';
        statusCode = 400;
    }
    
    if (err.message === "Only PDF files are allowed") {
        message = err.message
        statusCode = 400
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler