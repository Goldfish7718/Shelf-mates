"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MAIN_API_URL = process.env.MAIN_API_URL || "http://localhost:3000";
const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8000";
if (process.env.ORIGIN) {
    app.use((0, cors_1.default)({
        credentials: true,
        origin: process.env.ORIGIN,
    }));
}
else {
    app.use((0, cors_1.default)());
}
app.use((0, cookie_parser_1.default)());
app.use("/chat", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: AGENT_API_URL,
    changeOrigin: true,
}));
app.use(["/auth", "/product", "/cart", "/order", "/address", "/review", "/admin"], (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: MAIN_API_URL,
    changeOrigin: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Welcome to Shelf mates PROXY", status: "OK", timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`Proxy server started on port ${PORT}`);
});
