import type { FastifyInstance } from "fastify";
import { getUserController } from "../controller/get-users-controller.js";
import { getUserInfoController } from "../controller/get-user-info-controller.js";
import { disableUserAccountReq } from "../schemas/disable-account-schema.js";
import { sendUserPasswordResetController } from "../controller/send-password-controller.js";
import { firebaseAuthPreHandler } from "../../../plugin/firebase-plug.js";

export function userModRoutes(fastify: FastifyInstance){
    fastify.route({
        url: '/get-users',
        method: 'GET',
        handler: getUserController
    })

    fastify.route({
        url: '/get-user-info/:id',
        method: 'GET',
        handler: getUserInfoController
    })

    fastify.route({
        url: '/disable-account',
        method: 'POST',
        schema: {
            body: disableUserAccountReq 
        }, preHandler: firebaseAuthPreHandler,
        handler: getUserInfoController
    })

    fastify.route({
        url: '/send-password-reset',
        method: 'POST',
        schema: {
            body: disableUserAccountReq 
        }, preHandler: firebaseAuthPreHandler,
        handler: sendUserPasswordResetController
    })

}