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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: '../config/config.env',
});
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const Bootcamp_1 = __importDefault(require("./models/Bootcamp"));
const Course_1 = __importDefault(require("./models/Course"));
const User_1 = __importDefault(require("./models/User"));
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(process.env.MONGO_URI);
// console.log(fs.readFileSync(`${__dirname}`), 'whassup');
const bootcamps = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
// Import into db
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp_1.default.create(bootcamps);
        yield Course_1.default.create(courses);
        yield User_1.default.create(users);
        console.log('Data imported'.green.inverse);
        process.exit();
    }
    catch (error) {
        console.log(error);
    }
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp_1.default.deleteMany();
        yield Course_1.default.deleteMany();
        yield User_1.default.deleteMany();
        console.log('Data destroyed'.red.inverse);
        process.exit();
    }
    catch (error) {
        console.log(error);
    }
});
if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}
