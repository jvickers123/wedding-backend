import mongoose, { Mongoose } from 'mongoose';

export type BootcampType = {
  name?: string;
  description: string;
  address?: string;
  careers?: string[];
  slug?: string;
  email?: string;
  website?: string;
  phone?: string;
  location?: {
    type?: string;
    coordinates?: number[];
    formattedAddress?: string;
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  averageCost?: number;
  photo?: string;
  housing?: boolean;
  jobAssisztance?: boolean;
  jobGuarantee?: boolean;
  acceptGi?: boolean;
  createdAt?: Date;
  averageRating?: number;
};

export type BootCampSchemaType = mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any, any>,
  {},
  {},
  {},
  {},
  mongoose.DefaultSchemaOptions,
  BootcampType
>;

export type CoursesType = {
  title: string;
  description: string;
  weeks: string;
  tuition: number;
  minimumSkill: 'beginner' | 'intermediate' | 'advanced';
  scholarshipAvailable: boolean;
  createdAt: Date;
  bootcamp: mongoose.Types.ObjectId;
};

export type CoursesSchemaType = mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any, any>,
  {},
  {},
  {},
  {},
  mongoose.DefaultSchemaOptions,
  CoursesType
>;

export type AdvancedResults = {
  success: boolean;
  count: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: BootcampType[] | CoursesType[];
};
