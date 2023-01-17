import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bootcamp: {
    type: mongoose.Types.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

export default mongoose.model('Review', ReviewSchema);
