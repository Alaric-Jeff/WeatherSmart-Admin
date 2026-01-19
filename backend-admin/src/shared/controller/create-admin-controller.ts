import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import type { createAdminAccountType } from "../schema.js";
import { createAdminAccount } from "../service/create-admin.js";

export async function createAdminAccountController(
    req: FastifyRequest<{Body: createAdminAccountType}>,
    reply: FastifyReply
){
    const {email, firstName, lastName, middleName, password, confirmPassword} = req.body
    try{

        if(!req.user?.uid){
            return reply.code(401).send({
                message: "Unauthorized"
            })        
        }

        if(password !== confirmPassword){
            return reply.code(400).send({
                message: "Password and confirm password do not match"
            })
        }

        const adminId = req.user.uid;
        const normalizedFirstName = firstName?.trim() ?? "";
        const normalizedLastName = lastName?.trim() ?? "";
        const normalizedMiddleName = middleName?.trim() ?? "";

        const res = await createAdminAccount(req.server, {
            superAdminId: adminId,
            email,
            firstName: normalizedFirstName || undefined,
            lastName: normalizedLastName || undefined,
            middleName: normalizedMiddleName || undefined,
            password
        })

        return reply.code(200).send({
            message: "Admin created successfully",
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