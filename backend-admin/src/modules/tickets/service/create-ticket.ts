import type { FastifyInstance } from "fastify";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";
import { ServiceError } from "../../../error/service-error.js";

export async function createTicket(
  fastify: FastifyInstance,
  body: {
    userId: string;
    description: string;
    issueType: string;
    notes: string;
  }
) {
  try {
    const userSnap = await fastify.db
      .collection("users")
      .doc(body.userId)
      .get();

    if (!userSnap.exists) {
      throw new ServiceError(404, "User not found");
    }

    const userData = userSnap.data()!;

    
    const ticketRef = await fastify.db.collection("tickets").add({
      userId: body.userId,
      userName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      description: body.description,
      issueType: body.issueType,
      notes: body.notes,
      status: "Open",
      createdAt: new Date(),
      updatedAt: new Date()
    });


    return {
      ticketId: ticketRef.id,
      status: "Open"
    };
  } catch (err) {
    if (err instanceof ServiceError) {
      throw err;
    }

    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
