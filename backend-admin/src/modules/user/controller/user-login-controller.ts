import type { FastifyReply, FastifyRequest } from "fastify";
import { userLoginService } from "../service/user-login.js";

interface UserLoginBody {
  email: string;
  password: string;
}

export async function userLoginController(
  request: FastifyRequest<{ Body: UserLoginBody }>,
  reply: FastifyReply
) {
  try {
    const result = await userLoginService(request.server, request.body);
    return reply.code(200).send(result);
  } catch (err: any) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({
      error: err.message || "Internal Server Error"
    });
  }
}
