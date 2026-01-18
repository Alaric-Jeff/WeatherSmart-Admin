import type { FastifyRequest, FastifyReply } from "fastify";
import { createDevice } from "../service/create-device.js";
import { ServiceError } from "../../../error/service-error.js";
import type { macId } from "../schema/device-id.js";
export async function createDeviceController(
    req: FastifyRequest<{Body: macId}>,
    reply: FastifyReply
){
    const {macId} = req.body

    try{
   if (!req.user?.uid) {
      throw new ServiceError(401, "Unauthorized");
    }

    const adminId = req.user.uid;

    await createDevice(req.server, {
        macId,
        adminId
    })

    return reply.code(201).send({
        message: "Successfully created device"
    })} catch (err: unknown) {
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