"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    console.log(error, err, Object.assign({}, err));
    // mongoose bad object id
    if (err.name === 'CastError') {
        const castError = err;
        const message = `Nothing found with id ${castError.value}`;
        error = new errorResponse_1.ErrorResponse(message, 404);
    }
    // Duplicate name error
    if ('code' in err && err.code === 11000) {
        const message = 'Duplicate Value entered';
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    // Missing fields
    if (err.name === 'ValidationError' && 'errors' in err) {
        const validationErrors = err.errors;
        const message = Object.values(validationErrors)
            .map((error) => error.message)
            .join(', ');
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    if (err.name === 'MongooseError') {
        error.message = err.message;
        if (err.message !== 'There was a problem with file upload')
            error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};
exports.default = errorHandler;
