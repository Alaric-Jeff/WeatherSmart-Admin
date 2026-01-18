import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../error/service-error.js";

export async function verifyEmailAdmin(
  fastify: FastifyInstance,
  body: { email: string }
) {
  try {
    if (!body.email) {
      throw new ServiceError(400, "Email is required");
    }

    // 1️⃣ Generate Firebase email verification link
    const link = await fastify.firebaseAdmin
      .auth()
      .generateEmailVerificationLink(body.email);

    // 2️⃣ Send verification link via Nodemailer plugin
    await fastify.email.sendMail({
      from: `"Your App" <no-reply@yourapp.com>`,
      to: body.email,
      subject: "Verify your email",
      html: `
        <p>Hello,</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${link}">Verify Email</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    return {
      message: "Email verification link sent successfully",
    };
  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
