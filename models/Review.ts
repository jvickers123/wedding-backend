import mongoose from 'mongoose';
import { GetAverageRatingConstructor, ReviewType } from '../helpers/types';
import Bootcamp from './Bootcamp';

const ReviewSchema = new mongoose.Schema(
  {
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
  },
  {
    statics: {
      async getAverageRating(bootcampId: mongoose.Types.ObjectId) {
        const obj = await this.aggregate([
          {
            $match: { bootcamp: bootcampId },
          },
          {
            $group: {
              _id: '$bootcamp',
              averageRating: { $avg: '$rating' },
            },
          },
        ]);

        try {
          await Bootcamp.findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating,
          });
        } catch (err) {
          console.log(err);
        }
      },
    },
  }
);

ReviewSchema.post(
  'save',
  async function (this: ReviewType & GetAverageRatingConstructor) {
    await this.constructor.getAverageRating(this.bootcamp);
  }
);

ReviewSchema.pre(
  'remove',
  async function (this: ReviewType & GetAverageRatingConstructor) {
    await this.constructor.getAverageRating(this.bootcamp);
  }
);

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
