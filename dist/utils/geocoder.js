"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = void 0;
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './config/config.env' });
const options = {
    provider: 'mapquest',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
};
exports.geocoder = (0, node_geocoder_1.default)(options);
