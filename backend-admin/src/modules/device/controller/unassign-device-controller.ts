import type { FastifyRequest, FastifyReply} from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { unassignDevice } from "../service/unassign-device.js";
import type { assignDeviceReq } from "../schema/assign-device.js";
export async function unassignDeviceController(
    req: FastifyRequest<{Body: assignDeviceReq}>,
    reply: FastifyReply
){
    const {
        deviceId,
        userId,
        reason
    } = req.body;
    try{
   if (!req.user?.uid) {
      throw new ServiceError(401, "Unauthorized");
    }

    const adminId = req.user.uid;
    const normalizedReason = reason ?? ""
    await unassignDevice(req.server, {
        adminId,
        deviceId,
        userId,
        reason: normalizedReason
    });

    return reply.code(200).send({
        message: "Successfully unassigned device",
    })

    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
        req.log.error(`Error occured in device controller, error: ${err}`)
        return reply.code(500).send({
            message: "Internal Server Error"
        })
    }
}