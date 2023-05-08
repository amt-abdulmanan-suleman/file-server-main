import nodemailer from 'nodemailer'
import { EMAIL_PWD, EMAIL_USER } from '../config';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: EMAIL_USER,
    pass: EMAIL_PWD,
    },
});
