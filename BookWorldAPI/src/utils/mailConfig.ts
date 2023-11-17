import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const SENDER = process.env.SENDER_MAIL!;


//TODO: add mail_template database table
// templateID, requiredDynamicData

const dynamicData = {
    app_user_name: 'Michał',
};


export function createMail(mail: string) {
    return {
        to: mail,
        from: SENDER,
        templateId: "d-191427bcc5954fc8a4f061985e7b2684",
        dynamicTemplateData: dynamicData,
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
