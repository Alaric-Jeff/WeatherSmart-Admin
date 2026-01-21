import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import { changeAdminPassword } from "../service/change-password.js";

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordController(
  req: FastifyRequest<{ Body: ChangePasswordBody }>,
  reply: FastifyReply
) {
  try {
    if (!req.user?.uid) {
      return reply.code(401).send({
        message: "Unauthorized"
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return reply.code(400).send({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 8) {
      return reply.code(400).send({
        message: "New password must be at least 8 characters long"
      });
    }

    await changeAdminPassword(req.server, req.user.uid, currentPassword, newPassword);

    return reply.code(200).send({
      message: "Password changed successfully"
    });
  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      return reply.code(err.statusCode).send({
        message: err.message
      });
    }
    return reply.code(500).send({
      message: "Internal Server Error"
    });
  }
}
