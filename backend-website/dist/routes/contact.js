"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const storage_1 = require("../storage");
const router = (0, express_1.Router)();
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    email: zod_1.z.string().email(),
    type: zod_1.z.string().min(2).max(100),
    message: zod_1.z.string().min(10).max(5000)
});
router.post('/', (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            ok: false,
            error: 'Invalid input',
            details: parsed.error.flatten()
        });
    }
    const { name, email, type, message } = parsed.data;
    const saved = (0, storage_1.addInquiry)({ name, email, type, message });
    return res.status(201).json({ ok: true, id: saved.id });
});
router.get('/', (_req, res) => {
    const rows = (0, storage_1.listInquiries)();
    return res.json({ ok: true, data: rows });
});
exports.default = router;
