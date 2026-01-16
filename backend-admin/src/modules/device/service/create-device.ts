import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";

export async function createDevice(
  fastify: FastifyInstance,
  body: {
    macId: string,
    adminId: string
  }
) {
  try {
    const now = new Date();

    const device = await fastify.db.collection("devices").add({
      macId: body.macId,
      assignedTo: [],
      status: "not paired",
      createdAt: now,
      updatedAt: now
    });

    await createAuditFunction(fastify, {
        adminId: body.adminId,
        action: "device created",
        target: device.id
    });

    return {
      deviceId: device.id,
      macId: body.macId,
      status: "not paired",
      assignedTo: []
    };

  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal server error");
  }
}
