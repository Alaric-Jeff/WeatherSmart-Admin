import type { FastifyReply, FastifyRequest } from "fastify";
import { updateUserService } from "../service/update-user.js";

interface UpdateUserParams {
  userId: string;
}

export async function updateUserController(
  request: FastifyRequest<{ Params: UpdateUserParams; Body: Record<string, unknown> }>,
  reply: FastifyReply
) {
  try {
    const result = await updateUserService(request.server, {
      userId: request.params.userId,
      ...request.body,
    });

    return reply.code(200).send({
      message: "User updated",
      data: result,
    });
  } catch (err: any) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  }
}