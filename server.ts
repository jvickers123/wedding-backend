import { config } from 'dotenv';
config({ path: './config/config.env' });

import bootcampRouter from './routes/bootcamps';
import courseRouter from './routes/courses';
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/database';
import 'colors';
import errorHandler from './middleware/error';
import fileUpload from 'express-fileupload';
import path from 'path';

connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// file uploading
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

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
