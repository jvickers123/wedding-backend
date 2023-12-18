import mongoose from 'mongoose';
import slugify from 'slugify';
import { GuestSchemaType } from '../helpers/types';

const GuestSchema: GuestSchemaType = new mongoose.Schema(
{
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please add a valid email',
      ],
    },
    slug: String,
    accomodation: {
      type: String,
    },
    attending: {
      type: String,
    },
    price: {
      type: Number,
    },
    fullDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

// create guest slug from the name
GuestSchema.pre('save', function (next) {
  this.slug = slugify(this.name!, { lower: true });
  next();
});



export default mongoose.model('Guest', GuestSchema);
