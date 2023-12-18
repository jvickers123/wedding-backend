"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, _res, next) => {
    console.log('Middleware ran');
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};
exports.default = logger;
