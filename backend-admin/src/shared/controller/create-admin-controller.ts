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

        // Build payload with only defined properties
        const payload: {
          superAdminId: string;
          email: string;
          firstName?: string;
          lastName?: string;
          middleName?: string;
          password: string;
        } = {
          superAdminId: adminId,
          email,
          password
        };

        if (firstName) payload.firstName = firstName;
        if (lastName) payload.lastName = lastName;
        if (middleName) payload.middleName = middleName;

        const res = await createAdminAccount(req.server, payload)

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