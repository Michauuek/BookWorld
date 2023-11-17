
import sgMail from '@sendgrid/mail'
import {createMail} from "../utils/mailConfig";
import {EmailRequest} from "../model/mailDto";

export class MailService {


    async sendMail(mailRequest: EmailRequest) {
        const msg = createMail(mailRequest.email);
        console.log(mailRequest, msg);
        try {
            const response = await sgMail.send(msg);
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

}