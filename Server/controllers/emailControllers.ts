
import db from '../db';
import { transporter } from '../utils/transporter';
import  {EMAIL_USER}  from '../config';

export async function sendVerificationEmail(userId: number, email: string): Promise<void> {
  const token = Math.floor(100000 + Math.random() * 900000);
  await db.query('INSERT INTO verification_tokens (user_id, email, token) VALUES ($1, $2, $3)', [userId,email, token]);

  

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Hello,</p>
      <p>Thank you for signing up! Please this is your verification token:</p>
      <p>${token}</p>
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

    return userId
  }
  