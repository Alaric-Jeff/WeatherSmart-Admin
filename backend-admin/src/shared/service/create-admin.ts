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

    const userRecord = await fastify.firebaseAuthSdk.createUser({
      email: body.email,
      password: body.password,
      displayName,
    });

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

    // Send welcome email with credentials
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .credentials { background-color: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0; }
            .credential-item { margin: 10px 0; }
            .credential-label { font-weight: bold; color: #4F46E5; }
            .credential-value { font-family: monospace; background-color: #f3f4f6; padding: 5px 10px; border-radius: 3px; display: inline-block; }
            .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Admin Portal</h1>
            </div>
            <div class="content">
              <p>Hello ${displayName},</p>
              <p>Your admin account has been successfully created. Below are your login credentials:</p>
              
              <div class="credentials">
                <div class="credential-item">
                  <span class="credential-label">Email:</span><br/>
                  <span class="credential-value">${body.email}</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">Temporary Password:</span><br/>
                  <span class="credential-value">${body.password}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>Please change your password immediately after your first login</li>
                  <li>Do not share your credentials with anyone</li>
                  <li>This email contains sensitive information - please delete it after changing your password</li>
                </ul>
              </div>

              <p>You can access the admin portal at: <strong>http://localhost:5173/login</strong></p>
            
              <p>If you have any questions or need assistance, please contact the system administrator.</p>
              
              <p>Best regards,<br/>The Admin Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailText = `
Welcome to the Admin Portal

Hello ${displayName},

Your admin account has been successfully created. Below are your login credentials:

Email: ${body.email}
Temporary Password: ${body.password}

SECURITY NOTICE:
- Please change your password immediately after your first login
- Do not share your credentials with anyone
- This email contains sensitive information - please delete it after changing your password

You can access the admin portal at: [Your Portal URL]

If you have any questions or need assistance, please contact the system administrator.

Best regards,
The Admin Team

---
This is an automated message. Please do not reply to this email.
      `;

      await fastify.email.sendMail({
        from: process.env.SMTP_USER || "noreply@yourdomain.com",
        to: body.email,
        subject: "Your Admin Account Credentials",
        text: emailText,
        html: emailHtml,
      });

      fastify.log.info(`Credentials email sent to ${body.email}`);
    } catch (emailError) {
      // Log email error but don't fail the account creation
      fastify.log.error({ err: emailError }, "Failed to send credentials email");
    }

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