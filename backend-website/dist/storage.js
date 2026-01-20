"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStorage = initStorage;
exports.addInquiry = addInquiry;
exports.listInquiries = listInquiries;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.resolve(process.cwd(), 'data');
const filePath = path_1.default.join(dataDir, 'inquiries.json');
function initStorage() {
    if (!fs_1.default.existsSync(dataDir))
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    if (!fs_1.default.existsSync(filePath))
        fs_1.default.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
}
function readAll() {
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
function writeAll(items) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
}
function addInquiry(input) {
    const items = readAll();
    const now = new Date().toISOString();
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const record = { id, created_at: now, ...input };
    items.push(record);
    writeAll(items);
    return record;
}
function listInquiries() {
    return readAll().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}
