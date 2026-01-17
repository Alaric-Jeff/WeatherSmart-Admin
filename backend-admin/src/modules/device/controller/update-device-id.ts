import type { FastifyRequest, FastifyReply} from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { updateDevice } from "../service/update-device-id.js";
import type { updateDeviceReqType } from "../schema/update-device-req.js";
export async function updateDeviceMacId(
    req: FastifyRequest<{Body: updateDeviceReqType}>,
    reply: FastifyReply
){
    const {
        id,
        macId,
        reason
    } = req.body;
    try{
    if (!req.user?.uid) {
      throw new ServiceError(401, "Unauthorized");
    }
    const adminId = req.user.uid;
    const normalizedReason = reason ?? "";
    await updateDevice(req.server, {
        adminId,
        id,
        macId,
        reason: normalizedReason
    })

    return reply.code(200).send({
        message: "Successfully updated device"
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