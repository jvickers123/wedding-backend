"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bootcamps_1 = require("../controllers/bootcamps");
const router = (0, express_1.Router)();
router.route('/').get(bootcamps_1.getBootcamps).post(bootcamps_1.createBootcamp);
router
    .route('/:id')
    .get(bootcamps_1.getSingleBootcamp)
    .put(bootcamps_1.updateBootcamp)
    .delete(bootcamps_1.deleteBootcamp);
exports.default = router;
