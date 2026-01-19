import type { FastifyInstance } from "fastify";
import { createAdminAccountSchema, signinReq } from "../schema.js";
import { SignInController } from "../controller/signin-controller.js";
import { firebaseAuthPreHandler } from "../../plugin/firebase-plug.js";
import { createAdminAccountController } from "../controller/create-admin-controller.js";
import { verifyEmailAdminController } from "../controller/verifyAdminController.js";
import { getAdminsController } from "../controller/get-admins-controller.js";

export function adminRoutes(fastify: FastifyInstance) {
  // Signin route
  fastify.route({
    url: "/signin",
    method: "POST",
    schema: {
      body: signinReq,
    },
    handler: SignInController,
  });

  // Create admin route
  fastify.route({
    url: "/create-admin",
    method: "POST",
    schema: {
      body: createAdminAccountSchema,
    },
    preHandler: firebaseAuthPreHandler,
    handler: createAdminAccountController,
  });

  // Get admins route
  fastify.route({
    url: "/get-admins",
    method: "GET",
    preHandler: firebaseAuthPreHandler,
    handler: getAdminsController,
  });

  // Verify email route
  fastify.route({
    url: "/verify-email",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    },
    handler: verifyEmailAdminController,
  });
}
