"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerMiddleware = void 0;
const expectedHeaderValue = process.env.CUSTOM_HEADER_VALUE;
const headerMiddleware = (req, res, next) => {
    const customHeader = req.headers['x-custom-header'];
    if (customHeader === expectedHeaderValue) {
        next();
    }
    else {
        res.status(403).json({ error: 'Forbidden' });
    }
};
exports.headerMiddleware = headerMiddleware;
