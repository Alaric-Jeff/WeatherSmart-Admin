import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { sendUserPasswordReset } from "../service/send-password-reset.js";

export async function sendUserPasswordResetController(
    req: FastifyRequest<{Body: {reason: string, userId: string}}>,
    reply: FastifyReply
){
    const {
        reason,
        userId
    } = req.body;
    try{
          if (!req.user?.uid) {
              throw new ServiceError(401, "Unauthorized");
          }
          const adminId = req.user.uid

          await sendUserPasswordReset(req.server, {
            adminId,
            userId,
            reason
          })

        return reply.code(200).send({
            message: "Successfully send a reset password link to user"
        });
    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
        return reply.code(500).send({
            message: "Internal Server Error"
        })
    }
}