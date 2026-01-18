import type { FastifyRequest, FastifyReply } from "fastify";
import { disableUserAccount } from "../service/disable-account.js";
import { ServiceError } from "../../../error/service-error.js";
import type { disableUserAccountReq } from "../schemas/disable-account-schema.js";
export async function disableAccountController(
    req: FastifyRequest<{Body: disableUserAccountReq}>,
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

        await disableUserAccount(req.server, {
            reason,
            userId,
            adminId
        })

        return reply.code(200).send({
            message: "Successfully disabled user account"
        })
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