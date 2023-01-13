import { NextFunction, Request, Response } from 'express';
import type { Model } from 'mongoose';
import {
  BootCampSchemaType,
  BootcampType,
  CoursesSchemaType,
  CoursesType,
  AdvancedResults,
} from '../helpers/types';

export const advancedResults =
  (model: Model<any>, populate = '') =>
  async (
    req: Request,
    res: Response & { advancedResults?: AdvancedResults },
    next: NextFunction
  ) => {
    const { select, sort, page, limit, ...queryClone } = req.query;

    // create operators
    const queryString = JSON.stringify(queryClone);
    const queryWith$AtFront = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => '$' + match
    );

    // find fields to select or use empty string
    const fields = select ? (select as string).replace(/,/g, ' ') : '';

    // find sort instructions or use DESC createdaAt by default
    const sortBy = sort ? (sort as string).replace(/,/g, ' ') : '-createdAt';

    // Pagination
    const pageInt = page ? +page : 1;
    const limitInt = limit ? +limit : 25;
    const startInd = (pageInt - 1) * limitInt;
    const endInd = pageInt * limitInt;
    const total = await model.countDocuments();

    const results: BootcampType[] | CoursesType[] = await model
      .find(JSON.parse(queryWith$AtFront))
      .select(fields)
      .sort(sortBy)
      .skip(startInd)
      .limit(limitInt)
      .populate(populate);

    const pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    } = {};

    if (endInd < total) {
      pagination.next = { page: pageInt + 1, limit: limitInt };
    }

    if (startInd > 0) {
      pagination.prev = { page: pageInt - 1, limit: limitInt };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };
    next();
  };
