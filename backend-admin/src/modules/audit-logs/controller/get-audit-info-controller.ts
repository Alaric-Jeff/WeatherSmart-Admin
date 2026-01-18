import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getAuditInfo } from "../service/get-audit-log-info.js";

export async function getAuditInfoController(
    req: FastifyRequest<{Querystring: {id: string}}>,
    reply: FastifyReply
){
    const {id} = req.query
    try{

        const auditInfo = await getAuditInfo(req.server, {id});

        return reply.code(200).send({
            message: "Successfully fetched audits",
            data: auditInfo
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