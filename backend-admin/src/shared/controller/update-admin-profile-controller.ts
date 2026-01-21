import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import { updateAdminProfile } from "../service/update-admin-profile.js";

interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  address?: string;
}

export async function updateAdminProfileController(
  req: FastifyRequest<{ Body: UpdateProfileBody }>,
  reply: FastifyReply
) {
  try {
    if (!req.user?.uid) {
      return reply.code(401).send({
        message: "Unauthorized"
      });
    }

    const adminId = req.user.uid;
    const { firstName, lastName, middleName, phoneNumber, address } = req.body;

    const updatedAdmin = await updateAdminProfile(req.server, adminId, {
      firstName,
      lastName,
      middleName,
      phoneNumber,
      address
    });

    return reply.code(200).send({
      message: "Profile updated successfully",
      data: updatedAdmin
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
