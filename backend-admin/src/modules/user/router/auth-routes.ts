import type { FastifyInstance } from "fastify";
import { userLoginController } from "../controller/user-login-controller.js";
import { userLoginSchema } from "../schemas/user-login-schema.js";

export function userAuthRoutes(fastify: FastifyInstance) {
  // User login route
  fastify.route({
    url: "/login",
    method: "POST",
    schema: {
      body: userLoginSchema,
    },
    handler: userLoginController,
  });
}
