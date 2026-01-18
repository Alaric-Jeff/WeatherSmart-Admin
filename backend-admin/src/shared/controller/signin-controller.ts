import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import { signin } from "../service/signin.js";
import type { SigninReq } from "../schema.js";
export async function SignInController(
    req: FastifyRequest<{Body: SigninReq}>,
    reply: FastifyReply
){
    const {idToken} = req.body
    try{
        const res = await signin(req.server, {idToken});

        return reply.code(200).send({
            message: "Successful signin",
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