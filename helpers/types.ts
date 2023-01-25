import { Request, Response } from 'express';
import mongoose from 'mongoose';

export type BootcampType = {
  _id?: mongoose.Types.ObjectId;
  name?: string;
  description?: string;
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
  user?: mongoose.Types.ObjectId;
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
  user: mongoose.Types.ObjectId;
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
export type GetAverageCostConstructor = {
  constructor: {
    getAverageCost: (id: mongoose.Types.ObjectId) => Promise<void>;
  };
};

export type GetAverageRatingConstructor = {
  constructor: {
    getAverageRating: (id: mongoose.Types.ObjectId) => Promise<void>;
  };
};
export type AdvancedResults = {
  success: boolean;
  count: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: BootcampType[] | CoursesType[] | UserType[];
};

export type ResponseWithPagination = Response & {
  advancedResults?: AdvancedResults;
};

export enum UserRole {
  USER = 'user',
  PUBLISHER = 'publisher',
  ADMIN = 'admin',
}

export type UserType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  getSignedJWTToken: () => string;
  getResetPasswordToken: () => string;
};

export type RequestWithUser = Request & { user?: UserType };

export type ReviewType = {
  title: string;
  text: string;
  rating: number;
  user: mongoose.Types.ObjectId;
  bootcamp: mongoose.Types.ObjectId;
};

export type ReviewsModel = mongoose.Model<
  mongoose.FlatRecord<{
    user: {
      cacheHexString?: unknown;
      generate?: {} | undefined;
      createFromTime?: {} | undefined;
      createFromHexString?: {} | undefined;
      isValid?: {} | undefined;
      prototype?: mongoose.Types.ObjectId | undefined;
    };
    title: string;
    bootcamp: {
      prototype?: mongoose.Types.ObjectId | undefined;
      cacheHexString?: unknown;
      generate?: {} | undefined;
      createFromTime?: {} | undefined;
      createFromHexString?: {} | undefined;
      isValid?: {} | undefined;
    };
    rating: number;
  }>,
  {},
  {},
  {},
  any
>;
