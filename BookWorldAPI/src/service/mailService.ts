
import sgMail from '@sendgrid/mail'
import {createMail} from "../utils/mailConfig";
import {EmailRequest} from "../model/mailDto";

export class MailService {


    async sendMail(mailRequest: EmailRequest) {
        const msg = createMail(mailRequest.email);
        try {
            const response = await sgMail.send(msg);
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        } catch (error) {
            console.error(error);
        }
    }

}