"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const AccomodationSchema = new mongoose_1.default.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Guests',
        required: [true, 'Please add some guests'],
    },
    users: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// create accomoation slug from the name
AccomodationSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
exports.default = mongoose_1.default.model('Accomodation', AccomodationSchema);
