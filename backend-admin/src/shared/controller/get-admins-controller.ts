import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import { getAdmins } from "../service/get-admins.js";

export async function getAdminsController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    if (!req.user?.uid) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    const admins = await getAdmins(req.server);

    return reply.code(200).send({
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      return reply.code(err.statusCode).send({
        message: err.message,
      });
    }
    return reply.code(500).send({
      message: "Internal Server Error",
    });
  }
}
