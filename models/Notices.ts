import mongoose from 'mongoose';
import slugify from 'slugify';
import { NoticeSchemaType } from '../helpers/types';

const NoticeSchema: NoticeSchemaType = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title'],
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'Please add a message'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    slug: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create notice slug from the name
NoticeSchema.pre('save', function (next) {
  this.slug = slugify(this.title!, { lower: true });
  next();
});

export default mongoose.model('Notice', NoticeSchema);
