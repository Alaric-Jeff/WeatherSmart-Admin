import type { FastifyInstance } from "fastify";
import type { createAdminAccountType } from "../schema.js";
import { ServiceError } from "../../error/service-error.js";
import { createAuditFunction } from "../../modules/audit-logs/create-audit-log.js";

export async function createAdminAccount(
  fastify: FastifyInstance,
  body: Omit<createAdminAccountType, "confirmPassword"> & {
    superAdminId: string;
    password: string;
  }
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

    const displayName = [body.firstName, body.lastName]
      .filter((value) => Boolean(value && value.trim()))
      .join(" ")
      .trim() || body.email;

    // 2️⃣ Create Firebase Auth user with provided password
    const userRecord = await fastify.firebaseAuthSdk.createUser({
      email: body.email,
      password: body.password,
      displayName,
    });

    // 3️⃣ Save admin in Firestore with simplified shape (no email verification)
    await fastify.db.collection("admins").doc(userRecord.uid).set({
      adminId: userRecord.uid,
      email: body.email,
      emailVerified: false,
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      middleName: body.middleName ?? null,
      role: "admin",
      status: "active",
    });

    await createAuditFunction(fastify, {
      adminId: body.superAdminId,
      action: "Created admin account",
      target: userRecord.uid,
      reason: "Super-admin manual creation without email verification",
    });

    fastify.log.info(`Admin account created for ${body.email} with ID ${userRecord.uid}`);

    return {
      message: "Admin account created successfully.",
      adminId: userRecord.uid,
      email: body.email,
      emailVerified: false,
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      middleName: body.middleName ?? null,
      role: "admin",
      status: "active",
    };
  } catch (err: unknown) {
    fastify.log.error(err);
    // Surface useful errors instead of a generic 500
    const code = (err as { code?: string })?.code;
    const message = (err as { message?: string })?.message;

    if (code === "auth/email-already-exists") {
      throw new ServiceError(409, "Email already exists. Choose another email.");
    }

    if (code === "auth/invalid-password") {
      throw new ServiceError(400, "Password does not meet requirements.");
    }

    // Permission / network / unknown Firebase or Firestore issues
    throw new ServiceError(500, message || "Internal Server Error");
  }
}
