import { getAuthHeaders } from "../shared/get-auth-headers";

export async function getAuditLogsInfo(auditId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/audit-logs/get-audit-logs-info/${auditId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch audit log info: ${res.status} ${errorText}`
      );
    }

    const json = await res.json();
    const auditData = json.data;
    if (!auditData) return null; 

    return {
      ...auditData,
      createdAt: auditData.createdAt ? new Date(auditData.createdAt) : null,
      updatedAt: auditData.updatedAt ? new Date(auditData.updatedAt) : null,
    };
  } catch (err: unknown) {
    console.error("An error occurred in fetching the audit log:", err);
    throw err;
  }
}
