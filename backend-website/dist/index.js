"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const storage_1 = require("./storage");
const firebase_1 = require("./firebase");
const contact_1 = __importDefault(require("./routes/contact"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use((0, cors_1.default)({ origin: corsOrigin }));
app.use(express_1.default.json());
// Initialize storage and Firebase
(0, storage_1.initStorage)();
(0, firebase_1.initializeFirebase)();
// Health
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, status: 'healthy' });
});
// Contact/Inquiries
app.use('/api/contact', contact_1.default);
// Auth (demo)
app.use('/api/auth', auth_1.default);
// Static manuals (optional): serve PDFs from ./public/manuals
const manualsDir = path_1.default.resolve(process.cwd(), 'public', 'manuals');
app.use('/public/manuals', express_1.default.static(manualsDir));
// Error handler middleware
app.use((err, _req, res, _next) => {
    console.error('[Express Error]', err);
    res.status(err.status || 500).json({ ok: false, error: err.message || 'Internal Server Error' });
});
app.listen(port, () => {
    console.log(`[backend-website] listening on http://localhost:${port}`);
});
