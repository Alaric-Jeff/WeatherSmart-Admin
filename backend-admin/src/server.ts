import Fastify from "fastify";      
import dotenv from 'dotenv'
import firebasePlug from "./plugin/firebase-plug.js";
import { userModRoutes } from "./modules/user/router/index.js";
import { deviceModRouter } from "./modules/device/router/index.js";
import { auditModRouter } from "./modules/audit-logs/router/index.js";
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

dotenv.config();

const server = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

if (!process.env.HTTP_PORT || !process.env.HOST) {
  server.log.error("Missing required environment variables");
  console.log(String(process.env.HTTP_PORT));
  console.log(String(process.env.HOST));
  process.exit(1);
}

server.register(firebasePlug);
server.register(userModRoutes, {prefix: "/users"});
server.register(deviceModRouter, {prefix: "/devices"});
server.register(auditModRouter, {prefix: "/audit-logs"});
const PORT = Number(process.env.HTTP_PORT);
const HOST = process.env.HOST as string;

try {
  await server.listen({
    port: PORT,
    host: HOST,
  });
  server.log.info(`Server running at http://${HOST}:${PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}