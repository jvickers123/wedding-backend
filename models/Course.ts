import mongoose from 'mongoose';
import Bootcamp from './Bootcamp';

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    weeks: {
      type: String,
      required: [true, 'Please add a description'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bootcamp',
      required: true,
    },
  },
  {
    statics: {
      async getAverageCost(bootcampId: mongoose.Types.ObjectId) {
        const obj = await this.aggregate([
          {
            $match: { bootcamp: bootcampId },
          },
          {
            $group: {
              _id: '$bootcamp',
              averageCost: { $avg: '$tuition' },
            },
          },
        ]);

        try {
          await Bootcamp.findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost),
          });
        } catch (err) {
          console.log(err);
        }
      },
    },
  }
);

type Constructor = {
  getAverageCost: (id: mongoose.Types.ObjectId) => Promise<void>;
};

CourseSchema.post('save', async function () {
  await (this.constructor as unknown as Constructor).getAverageCost(
    this.bootcamp
  );
});

CourseSchema.pre('remove', async function () {
  await (this.constructor as unknown as Constructor).getAverageCost(
    (this as unknown as { bootcamp: mongoose.Types.ObjectId }).bootcamp
  );
});

export default mongoose.model('Course', CourseSchema);
