"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptEmail = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encryptEmail = (email) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(email);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
exports.encryptEmail = encryptEmail;
