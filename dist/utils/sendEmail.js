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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// async..await is not allowed in global scope, must use a wrapper
const sendEmail = ({ email, subject, text, }) => __awaiter(void 0, void 0, void 0, function* () {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
    });
    // send mail with defined transport object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: subject,
        text: text, // plain text body
    };
    const info = yield transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
});
exports.sendEmail = sendEmail;
