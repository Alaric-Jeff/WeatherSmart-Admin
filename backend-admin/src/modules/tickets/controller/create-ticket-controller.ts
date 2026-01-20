import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import type { CreateTicketBodyType } from "../schema/ticket-schemas.js";
import { createTicket } from "../service/create-ticket.js";
export async function createTicketController(
    req: FastifyRequest<{Body: CreateTicketBodyType}>, 
    reply: FastifyReply
){
    const {
        description,
        issueType,
        userId
    } = req.body;
    try{

 

        const res = await createTicket(req.server, {
            userId,
            description,
            issueType,
        })

        return reply.code(201).send({
            message: "Successfully created ticket",
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