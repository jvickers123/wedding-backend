"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedResults = void 0;
const advancedResults = (model, populate = '') => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.query, { select, sort, page, limit } = _a, queryClone = __rest(_a, ["select", "sort", "page", "limit"]);
    // create operators
    const queryString = JSON.stringify(queryClone);
    const queryWith$AtFront = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => '$' + match);
    // find fields to select or use empty string
    const fields = select ? select.replace(/,/g, ' ') : '';
    // find sort instructions or use DESC createdaAt by default
    const sortBy = sort ? sort.replace(/,/g, ' ') : '-createdAt';
    // Pagination
    const pageInt = page ? +page : 1;
    const limitInt = limit ? +limit : 25;
    const startInd = (pageInt - 1) * limitInt;
    const endInd = pageInt * limitInt;
    const total = yield model.countDocuments();
    const results = yield model
        .find(JSON.parse(queryWith$AtFront))
        .select(fields)
        .sort(sortBy)
        .skip(startInd)
        .limit(limitInt)
        .populate(populate);
    const pagination = {};
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
});
exports.advancedResults = advancedResults;
