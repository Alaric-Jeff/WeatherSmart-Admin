import type { FastifyInstance } from "fastify";
import { getTicketsController } from "../controller/get-tickets-controller.js";

export function ticketsRouter(fastify: FastifyInstance){
    fastify.route({
        url: '/get-tickets',
        method: 'GET',
        handler: getTicketsController
    })
}