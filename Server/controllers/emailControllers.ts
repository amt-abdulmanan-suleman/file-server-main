import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import db from '../db';
import { EMAIL_PWD, EMAIL_USER } from '../config';

export async function sendVerificationEmail(userId: number, email: string): Promise<void> {
  const token = randomBytes(16).toString('hex');
  await db.query('INSERT INTO verification_tokens (user_id, email, token) VALUES ($1, $2, $3)', [userId,email, token]);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PWD,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Hello,</p>
      <p>Thank you for signing up! Please this is your verification token:</p>
      <h1>${token}</h1>
    `,
  };

  await transporter.sendMail(mailOptions);
}
export async function verifyEmail(token: string): Promise<void> {
    const result = await db.query('SELECT user_id FROM verification_tokens WHERE token = $1', [token]);
    const { rows } = result;
    if (rows.length === 0) {
      throw new Error('Invalid token');
    }
  
    const userId = rows[0].user_id;
    await db.query('UPDATE users SET isVerified = true WHERE id = $1', [userId]);
    await db.query('DELETE FROM verification_tokens WHERE token = $1', [token]);
  }
  