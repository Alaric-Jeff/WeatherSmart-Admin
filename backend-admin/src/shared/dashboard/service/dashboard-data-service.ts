import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
export async function getDashboardDataService(
    fastify: FastifyInstance
){
    try{
        const userSnapshot = await fastify.db.collection('users').get();
        const userCount = userSnapshot.size;

        const deviceSnapshot = await fastify.db.collection('devices').get();
        const deviceCount = deviceSnapshot.size;

        const ticketSnapshot = await fastify.db.collection('tickets').get();
        const ticketCount = ticketSnapshot.size;

    }catch(err: unknown){
        fastify.log.error(err);
        throw new ServiceError(500, "Internal Server Error");
    }
}