import { type FastifyRequest, type FastifyReply, fastify } from "fastify";
import { getUserInfoService } from "../service/get-user-info.js";
import type { userUuidType } from "../schemas/user-uuid.js";
import { ServiceError } from "../../../error/service-error.js";

export async function getUserInfoController(
    req: FastifyRequest<{Params: userUuidType}>,
    reply: FastifyReply
){

    const {
        userId
    } = req.params;

    try{
        req.log.info(`current userId in controller: ${userId}`)
        const userInfo = await getUserInfoService(req.server, {userId});
        
        // Log the devices properly
        req.log.info(`fetched devices count: ${userInfo.devices.length}`)
        req.log.info({ devices: userInfo.devices }, 'fetched devices data')
        
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