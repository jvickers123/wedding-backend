"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const bootcamps_1 = __importDefault(require("./routes/bootcamps"));
const database_1 = __importDefault(require("./config/database"));
require("colors");
(0, dotenv_1.config)({ path: './config/config.env' });
const app = (0, express_1.default)();
(0, database_1.default)();
// Dev logging middleware
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// Mount routers
app.use('/api/v1/bootcamps', bootcamps_1.default);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta));
// handle unhandle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error ${err.message}`.red);
    server.close(() => process.exit(1));
});
