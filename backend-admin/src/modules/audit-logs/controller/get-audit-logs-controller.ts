import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getAuditLogs } from "../service/get-audit-logs.js";

export async function getAuditLogsController(
    req: FastifyRequest,
    reply: FastifyReply
){
    try{
        const audits = await getAuditLogs(req.server);

        return reply.code(200).send({
            message: "Successfully fetched audits",
            data: audits
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