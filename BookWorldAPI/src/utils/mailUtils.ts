import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const SENDER = process.env.SENDER_MAIL!;

export const SEND_EMAIL_ENABLED = false;