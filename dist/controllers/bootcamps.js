"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBootcamp = exports.updateBootcamp = exports.createBootcamp = exports.getSingleBootcamp = exports.getBootcamps = void 0;
/**
 * Gets all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
const getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};
exports.getBootcamps = getBootcamps;
/**
 * Gets single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
const getSingleBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};
exports.getSingleBootcamp = getSingleBootcamp;
/**
 * Gets single bootcamps
 * @route POST /api/v1/bootcamps
 * @access Private
 */
const createBootcamp = (req, res, next) => {
    res.status(201).json({ success: true, msg: 'Create new bootcamp' });
};
exports.createBootcamp = createBootcamp;
/**
 * Update bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
const updateBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};
exports.updateBootcamp = updateBootcamp;
/**
 * Delete bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
const deleteBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
exports.deleteBootcamp = deleteBootcamp;
