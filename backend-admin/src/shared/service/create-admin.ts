import type { FastifyInstance } from "fastify";
import type { createAdminAccountType } from "../schema.js";
import { ServiceError } from "../../error/service-error.js";
import { createAuditFunction } from "../../modules/audit-logs/create-audit-log.js";

export async function createAdminAccount(
  fastify: FastifyInstance,
  body: createAdminAccountType & { superAdminId: string }
) {
  try {
    // 1️⃣ Check super-admin exists
    const superAdminRef = await fastify.db
      .collection("admins")
      .doc(body.superAdminId)
      .get();

    if (!superAdminRef.exists) {
      throw new ServiceError(404, "Super-admin not found");
    }

    // 2️⃣ Create Firebase Auth user with temporary password
    const tempPassword = Math.random().toString(36).slice(-10); 
    const userRecord = await fastify.firebaseAuthSdk.createUser({
      email: body.email,
      password: tempPassword,
      displayName: `${body.firstName} ${body.lastName}`,
    });

    // 3️⃣ Save admin in Firestore
    await fastify.db.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      email: body.email,
      verified: false,
      createdAt: new Date(),
      createdBy: body.superAdminId,
    });

    // 4️⃣ Generate email verification link
    const link = await fastify.firebaseAuthSdk.generateEmailVerificationLink(
      body.email
    );

    // 5️⃣ Send email via Fastify email plugin
    await fastify.email.sendMail({
      from: '"WeatherSmart-Rack Team" <no-reply@yourapp.com>',
      to: body.email,
      subject: "Complete your admin account",
      html: `
        <p>Hello ${body.firstName},</p>
        <p>A super-admin has created an admin account for you.</p>
        <p>Click the link below to verify and complete your profile:</p>
        <a href="${link}">Complete Profile</a>
        <p>Your temporary password (for testing purposes): ${tempPassword}</p>
      `,
    });

    fastify.log.info(`Admin invitation sent to ${body.email}`);
    await createAuditFunction(fastify, {
      adminId: body.superAdminId,
      action: "Created admin account",
      target: userRecord.uid,
      reason: "Super-admin invitation",
    });

    return {
      message:
        "Admin account created successfully. Verification email sent.",
      tempPassword,
      verificationLink: link,
    };
  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
