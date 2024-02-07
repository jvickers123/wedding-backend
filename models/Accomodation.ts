import mongoose from 'mongoose';
import slugify from 'slugify';
import { AccomodationSchemaType, AccomodationType } from '../helpers/types';

const AccomodationSchema: AccomodationSchemaType = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,
    type: {
      required: [true, 'please add a type'],
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Guest',
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create accomoation slug from the name
AccomodationSchema.pre('save', function (next) {
  this.slug = slugify(this.name!, { lower: true });
  next();
});

export default mongoose.model('Accomodation', AccomodationSchema);
