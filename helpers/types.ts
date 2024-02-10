import { Request, Response } from 'express';
import mongoose from 'mongoose';

export type GuestType = {
  name: string;
  email?: string;
  slug?: string;
  accomodation?: string;
  attending?: 'yes' | 'no' | 'maybe';
  price: number;
  fullDay?: boolean;
  notes?: string;
};

export type GuestSchemaType = mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any, any>,
  {},
  {},
  {},
  {},
  mongoose.DefaultSchemaOptions,
  GuestType
>;

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
  data: GuestType[] | UserType[];
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

export type AccomodationType = {
  name: string;
  type: 'party' | 'empty';
  slug?: string;
  guests: mongoose.Types.ObjectId[];
  users?: mongoose.Types.ObjectId[];
  paid: boolean;
  price: number;
};

export type AccomodationSchemaType = mongoose.Schema<
  any,
  mongoose.Model<any, any, any, any, any>,
  {},
  {},
  {},
  {},
  mongoose.DefaultSchemaOptions,
  AccomodationType
>;
