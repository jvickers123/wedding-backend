import mongoose from 'mongoose';
import slugify from 'slugify';
import { AccomodationSchemaType } from '../helpers/types';

const AccomodationSchema: AccomodationSchemaType = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please add a name'],
    },
    type: {
      required: [true, 'please add a type'],
      type: String,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    paid: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Guests',
      required: [true, 'Please add some guests'],
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
