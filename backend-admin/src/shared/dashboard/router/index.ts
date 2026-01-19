import type { FastifyInstance } from "fastify";
import { dashboardDataController } from "../controller/dashboard-data-controller.js";

export function dashboardModRoute(
    fastify: FastifyInstance
){
    fastify.route({
        url: '/dashboard-data',
        method: 'GET',
        handler: dashboardDataController
    })
}