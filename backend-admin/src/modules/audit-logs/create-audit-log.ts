import type { FastifyInstance } from "fastify";
import type { CreateAuditType } from "./schema/create-audit-fn.js";
import { ServiceError } from "../../error/service-error.js";

/**
 * Creates an audit log entry for admin actions.
 *
 * This function validates the admin existence, constructs a readable
 * `performedBy` string, and stores an audit record in the `audit_logs`
 * collection for traceability and accountability.
 *
 * @param {FastifyInstance} fastify
 * Fastify server instance used to access Firestore and logging utilities.
 *
 * @param {CreateAuditType} body
 * Audit payload containing:
 * - `adminId`: Firestore document ID of the admin performing the action
 * - `action`: Description of the action performed (e.g. "device created")
 * - `target`: Identifier of the affected resource (e.g. device ID, user ID)
 *
 * @returns {Promise<{ auditId: string }>}
 * Returns the Firestore document ID of the created audit log entry.
 *
 * @throws {ServiceError}
 * - `400` if the admin does not exist
 * - `500` if an unexpected error occurs while creating the audit log
 */

export async function createAuditFunction(
    fastify: FastifyInstance,
    body: CreateAuditType       
) {
    try {
        const adminDoc = await fastify.db.collection('admins').doc(body.adminId).get();
        fastify.log.info(`Fetched admin id: ${body.adminId}`)
        if (!adminDoc.exists) {
            throw new ServiceError(400, "Admin not found");
        }

        const adminData = adminDoc.data();
        const normalizedReason = body.reason ?? "";
        const audit = await fastify.db.collection('audit_logs').add({
            performedBy: `${adminData!.firstName} ${adminData!.lastName} (${adminData!.email})`,
            action: body.action,
            target: body.target,
            reason: normalizedReason,
            timestamp: new Date().toISOString()
        });

        fastify.log.info(`Successfully added an audit log`)
        return { auditId: audit.id };
    } catch (err: unknown) {
        fastify.log.error(err);
        throw new ServiceError(500, "Internal Server Error");
    }
}
