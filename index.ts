import { config } from 'dotenv';
config({ path: './config/config.env' });

import express from 'express';
import guestRouter from './routes/guests';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import accomdationRouter from './routes/accomodation';
import guestAndAccomodationRouter from './routes/all';
import morgan from 'morgan';
import connectDB from './config/database';
import 'colors';
import errorHandler from './middleware/error';
import fileUpload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import serverless from 'serverless-http';

connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// file uploading
app.use(fileUpload());

// Sanitise data
app.use(expressMongoSanitize());

// Set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xssClean());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// prevent http param polution
app.use(hpp());

// enalble CORS
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/accomodation', accomdationRouter);
app.use('/api/v1/all', guestAndAccomodationRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
  )
);

// handle unhandle promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error ${err.message}`.red);
  server.close(() => process.exit(1));
});

module.exports.handler = serverless(app);
