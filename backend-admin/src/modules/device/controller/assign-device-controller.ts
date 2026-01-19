import type { FastifyRequest, FastifyReply } from "fastify";
import { assignDevice } from "../service/assign-device.js";
import type { assignDeviceReq } from "../schema/assign-device.js";
import { ServiceError } from "../../../error/service-error.js";

export async function assignDeviceController(
  req: FastifyRequest<{ Body: assignDeviceReq }>,
  reply: FastifyReply
) {
  try {
    if (!req.user?.uid) {
      req.log.info(`No current user: ${req.user?.uid}`)
      throw new ServiceError(401, "Unauthorized");
    }

    const { deviceId, userId, reason } = req.body;
    const adminId = req.user.uid;
    req.log.info(`admin id fetched: ${adminId}`)    
    const normalizedReason = reason ?? "";

    await assignDevice(req.server, {
      adminId,
      userId,
      deviceId,
      reason: normalizedReason
    });

    return reply.code(200).send({
      message: "Device assigned successfully",
    });

  } catch (err: unknown) {

    if (err instanceof ServiceError) {
      return reply.code(err.statusCode).send({
        message: err.message,
      });
    }

    req.log.error(err);
    return reply.code(500).send({
      message: "Internal Server Error",
    });
  }
}
