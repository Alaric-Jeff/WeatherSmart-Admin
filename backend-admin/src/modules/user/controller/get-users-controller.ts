import type { FastifyRequest, FastifyReply } from "fastify";
import { getUsersService } from "../service/get-users.js";
import { ServiceError } from "../../../error/service-error.js";

export async function getUserController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await getUsersService(req.server);

    return reply.code(200).send({
      message: "Successfully fetched users",
      data: users,
    });

  } catch (err) {
    if (err instanceof ServiceError) {
      return reply.code(err.statusCode).send({
        message: err.message,
      });
    }

    req.log.error(err);
    return reply.code(500).send({
      message: "Internal Server Error",
    });
  }
}
