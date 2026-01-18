import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import { verifyEmailAdmin } from "../service/verifyAdmin.js";

export async function verifyEmailAdminController(
    req: FastifyRequest<{Body: {email: string}}>,
    reply: FastifyReply
){
    const {
        email
    } = req.body
    try{

        const res = await verifyEmailAdmin(req.server, {email})

        return reply.code(200).send({
            message: "Successfully sent email verification",
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