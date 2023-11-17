import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const SENDER = process.env.SENDER_MAIL!;


//TODO: add mail_template database table
export const SUBJECT = "BookWorld";
export const BODY = '<h1>BookWorld</h1><p>Witaj w BookWorld!<br/> Cieszymy się, że jesteś z nami.</p>';



export function createMail(mail: string) {
    return {
        to: mail,
        from: SENDER,
        subject: SUBJECT,
        html: BODY,
    }
}

export function sendMail(to: string, subject: string, text: string, html: string) {
    const msg = {
        to: to,
        from: SENDER,
        subject: subject,
        text: text,
        html: html,
    }

    return sgMail.send(msg);
}
