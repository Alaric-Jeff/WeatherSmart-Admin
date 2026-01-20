import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import type { UpdateTicketStatusBodyType } from "../schema/ticket-schemas.js";
import { updateTicketStatus } from "../service/update-ticket-status.js";
export async function updateTicketController(
    req: FastifyRequest<{Body: UpdateTicketStatusBodyType}>, 
    reply: FastifyReply
){
    const {
        status,
        ticketId
    } = req.body;
    try{
        if(!req.user?.uid){
            return reply.code(401).send({
                message: "Unauthorized"
            })
        }
        const adminId = req.user.uid;      
        const res = await updateTicketStatus(req.server, {
            adminId,
            status,
            ticketId
        })
        return reply.code(200).send({
            message: "Successfully updated tickets",
            data: res
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