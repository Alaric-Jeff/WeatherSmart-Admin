import type { FastifyInstance } from "fastify";
import { getUserController } from "../controller/get-users-controller.js";
import { getUserInfoController } from "../controller/get-user-info-controller.js";
import { userUuid } from "../schemas/user-uuid.js";

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

}