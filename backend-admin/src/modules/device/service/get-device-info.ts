import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

export async function getDeviceInfo(
    fastify: FastifyInstance,
    body: { id: string }
) {
    try {
        const deviceRef = fastify.db.collection("devices").doc(body.id);
        const device = await deviceRef.get();

        if (!device.exists) {
            throw new ServiceError(404, "Device not found");
        }

        const deviceData = device.data() ?? {};

        return {
            id: device.id,               
            macId: deviceData.macId,
            status: deviceData.status,
            assignedTo: deviceData.assignedTo ?? [],
            createdAt: deviceData.createdAt,
            updatedAt: deviceData.updatedAt
        };

    } catch (err: unknown) {
        fastify.log.error(err);
        throw new ServiceError(500, "Internal Server Error");
    }
}
