import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import router from './routes/bootcamps';
import connectDB from './config/database';
import 'colors';

config({ path: './config/config.env' });

const app = express();

connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/bootcamps', router);

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
