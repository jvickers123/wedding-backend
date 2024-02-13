"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './config/config.env' });
const guests_1 = __importDefault(require("./routes/guests"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const accomodation_1 = __importDefault(require("./routes/accomodation"));
const all_1 = __importDefault(require("./routes/all"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
require("colors");
const error_1 = __importDefault(require("./middleware/error"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
(0, database_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Dev logging middleware
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// file uploading
app.use((0, express_fileupload_1.default)());
// Sanitise data
app.use((0, express_mongo_sanitize_1.default)());
// Set security headers
app.use((0, helmet_1.default)());
// prevent XSS attacks
app.use((0, xss_clean_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
app.use(limiter);
// prevent http param polution
app.use((0, hpp_1.default)());
// enalble CORS
app.use((0, cors_1.default)());
// set static folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Mount routers
app.use('/api/v1/guests', guests_1.default);
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/accomodation', accomodation_1.default);
app.use('/api/v1/all', all_1.default);
app.use(error_1.default);
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () =>
//   console.log(
//     `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
//   )
// );
// // handle unhandle promise rejections
// process.on('unhandledRejection', (err: Error) => {
//   console.log(`Error ${err.message}`.red);
//   server.close(() => process.exit(1));
// });
module.exports.handler = (0, serverless_http_1.default)(app);
