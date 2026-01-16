import type { FastifyRequest, FastifyReply } from "fastify";
import { getUserInfoService } from "../service/get-user-info.js";
import type { userUuidType } from "../schemas/user-uuid.js";
import { ServiceError } from "../../../error/service-error.js";

export async function getUserInfoController(
    req: FastifyRequest<{Querystring: userUuidType}>,
    reply: FastifyReply
){

    const {
        uuid
    } = req.query;

    try{
        const userInfo = await getUserInfoService(req.server, {uuid});

        return reply.code(200).send({
            message: "Successfully fetched user info",
            data: userInfo
        })

    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
    req.log.error(err);
    return reply.code(500).send({
      message: "Internal Server Error",
    });
    }
}
