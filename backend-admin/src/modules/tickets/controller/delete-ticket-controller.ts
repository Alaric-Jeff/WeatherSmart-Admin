import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import type { DeleteTicketBodyType } from "../schema/ticket-schemas.js";
import { deleteTickets } from "../service/delete-ticket.js";
export async function deleteTicketController(
    req: FastifyRequest<{Body: DeleteTicketBodyType}>, 
    reply: FastifyReply
){
    const {
        ticketId
    } = req.body
    try{
        if(!req.user?.uid){
            return reply.code(401).send({
                message: "Unauthorized"
            })
        }
        const adminId = req.user.uid;
        const res = await deleteTickets(req.server, {
            adminId,
            ticketId
        })
        return reply.code(200).send({
            message: "Successfully deleted ticket",
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