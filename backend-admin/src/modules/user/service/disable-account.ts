import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import type { disableUserAccountService } from "../schemas/disable-account-schema.js";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";

export async function disableUserAccount(
    fastify: FastifyInstance,
    body: disableUserAccountService
){
    try{
        const userRef = await fastify.db.collection('users').doc(body.userId).get();

        if(!userRef.exists){
            throw new ServiceError(404, "User not found")
        }

        const adminRef = await fastify.db.collection('admins').doc(body.adminId).get();

        if(!adminRef.exists){
            throw new ServiceError(404, "Admin not found")
        }

        await fastify.firebaseAuthSdk.updateUser(body.userId, {disabled: true})
        await createAuditFunction(fastify, {
            adminId: body.adminId,
            action: "user disabled",
            target: body.userId,
            reason: body.reason
        })
        return;
    }catch(err: unknown){
        fastify.log.error(err);
        throw new ServiceError(500, "Internal Server Error")
    }
}