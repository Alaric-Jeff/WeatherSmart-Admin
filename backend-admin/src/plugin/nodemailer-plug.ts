// plugins/email-plugin.ts
import fp from "fastify-plugin";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import nodemailer, {type Transporter,type SendMailOptions } from "nodemailer";

export interface EmailPluginOptions extends FastifyPluginOptions {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
}

declare module "fastify" {
  interface FastifyInstance {
    email: {
      transporter: Transporter;
      sendMail: (options: SendMailOptions) => Promise<void>;
    };
  }
}

export default fp(async function emailPlugin(
  fastify: FastifyInstance,
  options: EmailPluginOptions
) {
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: options.secure ?? true,
    auth: {
      user: options.user,
      pass: options.pass,
    },
  });

  fastify.decorate("email", {
    transporter,
    sendMail: async (mailOptions: SendMailOptions) => {
      await transporter.sendMail(mailOptions);
      fastify.log.info(`Email sent to ${mailOptions.to}`);
    },
  });
});
