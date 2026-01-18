import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import type { createAdminAccountType } from "../schema.js";
import { createAdminAccount } from "../service/create-admin.js";

export async function createAdminAccountController(
    req: FastifyRequest<{Body: createAdminAccountType}>,
    reply: FastifyReply
){
    const {email, firstName, lastName, middleName} = req.body
    try{

        if(!req.user?.uid){
            return reply.code(401).send({
                message: "Unauthorized"
            })        
        }

        const adminId = req.user.uid;
        const normalizedMiddleName = middleName ?? ""
        
        const res = await createAdminAccount(req.server, {
            superAdminId: adminId,
            email,
            firstName,
            lastName,
            middleName: normalizedMiddleName
        })

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