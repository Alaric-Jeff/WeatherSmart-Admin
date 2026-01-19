import { type FastifyRequest, type FastifyReply} from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { deleteDeviceService } from "../service/delete-device.js";

import { deleteDevice } from "../schema/device-id.js";
export async function deleteDeviceController(
    req: FastifyRequest<{Body: deleteDevice}>,
    reply: FastifyReply
){
    const {
       id, reason
    } = req.body;
    try{
   if (!req.user?.uid) {
      throw new ServiceError(401, "Unauthorized");
    }

    const adminId = req.user.uid;
    await deleteDeviceService(req.server, {
        adminId,
        id,
        reason
    })

    return reply.code(200).send({
      message: "Device deleted successfully",
    });
    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
        req.log.error(`Errpr occured in device controller, error: ${err}`)
        return reply.code(500).send({
            message: "Internal Server Error"
        })
    }
}