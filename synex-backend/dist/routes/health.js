"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.healthRouter = router;
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'synex-backend',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});
//# sourceMappingURL=health.js.map