import { Type, type Static } from "@sinclair/typebox";

export const CreateTicketBody = Type.Object({
  userId: Type.String(),
  description: Type.String({ minLength: 1 }),
  issueType: Type.String({ minLength: 1 }),
  notes: Type.String()
});

export type CreateTicketBodyType = Static<typeof CreateTicketBody>;

export const UpdateTicketStatusBody = Type.Object({
  ticketId: Type.String(),
  status: Type.Union([
    Type.Literal("Open"),
    Type.Literal("In-Progress"),
    Type.Literal("Resolved")
  ])
});

export type UpdateTicketStatusBodyType = Static<typeof UpdateTicketStatusBody>;

export const DeleteTicketBody = Type.Object({
  ticketId: Type.String()
});

export type DeleteTicketBodyType = Static<typeof DeleteTicketBody>;

