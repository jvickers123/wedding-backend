import mongoose from 'mongoose';
import slugify from 'slugify';
import { GuestSchemaType } from '../helpers/types';
import { encryptEmail } from '../utils/encryption';

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
    encryptedEmail: {
      type: String,
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
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    lunch: {
      type: String,
    },
    hotdog: {
      type: String,
    },
    dietryRequirements: {
      type: String,
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

  if (!this.isModified('email')) {
    return next();
  }

  // add encrypted password
  this.encryptedEmail = encryptEmail(this.email!);

  next();
});

GuestSchema.virtual('accomodationTents', {
  ref: 'Accomodation',
  localField: '_id',
  foreignField: 'guests',
  justOne: true,
});

GuestSchema.pre('find', function () {
  this.populate('accomodationTents');
});

export default mongoose.model('Guest', GuestSchema);
