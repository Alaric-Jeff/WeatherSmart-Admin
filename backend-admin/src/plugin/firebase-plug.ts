import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

/**
 * @module FastifyFirebasePlugin
 * @description Fastify plugin that initializes Firebase Admin, Firestore, and provides an auth preHandler.
 */

/**
 * Augment Fastify types to include Firebase Admin, Firestore, and authenticated user.
 */
declare module "fastify" {
  interface FastifyInstance {
    /** Firebase Admin SDK instance */
    firebaseAdmin: typeof admin;
    /** Firestore instance */
    db: FirebaseFirestore.Firestore;
    /** Auth preHandler function */
    firebaseAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;

    /** Firebase Admin Auth SDK (for updateUser, disableUser, etc.) */
    firebaseAuthSdk: admin.auth.Auth;
  }

  interface FastifyRequest {
    /** Decoded Firebase Auth token, or null if unauthenticated */
    user: admin.auth.DecodedIdToken | null;
  }
}

/**
 * Firebase auth preHandler for routes requiring authentication.
 *
 * @param {FastifyRequest} req - Incoming request object
 * @param {FastifyReply} reply - Reply object
 */
export async function firebaseAuthPreHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "AUTH_MISSING" }); // ADDED return
  }

  try {
    req.user = await admin
      .auth()
      .verifyIdToken(authHeader.replace("Bearer ", ""));
  } catch (error) {
    req.log.error(`token verification failed, error: ${error}`); // ADDED logging
    return reply.code(401).send({ error: "AUTH_INVALID" }); // ADDED return
  }
}

/**
 * Fastify plugin to initialize Firebase Admin and Firestore, and decorate Fastify instance and requests.
 *
 * @param {FastifyInstance} fastify - Fastify instance
 */
export default fp(async function firebasePlugin(fastify: FastifyInstance) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }

  // Decorate Fastify instance with Firebase Admin and Firestore
  fastify.decorate("firebaseAdmin", admin);
  fastify.decorate("db", admin.firestore());

  fastify.decorate("firebaseAuthSdk", admin.auth());

  // Decorate requests with user property
  fastify.decorateRequest("user", null);

  // Decorate instance with reusable auth preHandler
  fastify.decorate("firebaseAuth", firebaseAuthPreHandler);

  fastify.log.info("Firebase Admin, Firestore, and Auth initialized");
});