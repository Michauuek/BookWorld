
import sgMail from '@sendgrid/mail'
import {EmailRequest} from "../model/mailDto";
import {prisma} from "../utils/prisma";
import {SENDER} from "../utils/mailUtils";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import {BadRequestException} from "../exceptions/badRequestException";

export class MailService {


    async getTemplate(templateAliasName: string) {
        return prisma.mailTemplates.findUnique({
            where: {
                aliasName: templateAliasName
            }
        });
    }


    async sendMail(mailRequest: EmailRequest) {
        const template = await this.getTemplate(mailRequest.templateAliasName);

        if (!template) {
            throw new EntityNotFoundException(`Template with alias name ${mailRequest.templateAliasName} does not exist`)
        }

        const msg = this.createMail(mailRequest, template.id);
        console.log(mailRequest, msg);

        try {
            const response = await sgMail.send(msg);
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        } catch (e) {
            console.error((e as Error).message);
        }
    }

    private createMail(mailRequest: EmailRequest, templateId: string) {
        return {
            to: mailRequest.email,
            from: SENDER,
            templateId: templateId,
            dynamicTemplateData: mailRequest.requiredDynamicData,
        }
    }

}