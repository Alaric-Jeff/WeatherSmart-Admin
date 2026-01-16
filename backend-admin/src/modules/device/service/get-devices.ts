import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

export async function getDeviceService(
    fastify: FastifyInstance
){
    try{
        const devices = await fastify.db.collection('devices').get();

        return devices.docs.map(doc => {
            const data = doc.data() ?? {}

            return {
                uuid: doc.id,
                macId: data.macId,
                connectedUser: Array.isArray(data.connectedUsers) ? data.connectedUsers : [],
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        })

    }catch(err: unknown){
        throw new ServiceError(500, "Internal server error");
    }
}