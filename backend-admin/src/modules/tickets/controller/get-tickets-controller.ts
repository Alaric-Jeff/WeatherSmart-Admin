import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getTickets } from "../service/get-tickets.js";

export async function getTicketsController(
    req: FastifyRequest,
    reply: FastifyReply
){
    try{
        const tickets = await getTickets(req.server);

        return reply.code(200).send({
            message: "Successfully fetched tickets",
            data: tickets
        })

    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
    }
}