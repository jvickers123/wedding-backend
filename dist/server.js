"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './config/config.env' });
const bootcamps_1 = __importDefault(require("./routes/bootcamps"));
const courses_1 = __importDefault(require("./routes/courses"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
require("colors");
const error_1 = __importDefault(require("./middleware/error"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
(0, database_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// file uploading
app.use((0, express_fileupload_1.default)());
// set static folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Mount routers
app.use('/api/v1/bootcamps', bootcamps_1.default);
app.use('/api/v1/courses', courses_1.default);
app.use(error_1.default);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta));
// handle unhandle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error ${err.message}`.red);
    server.close(() => process.exit(1));
});
