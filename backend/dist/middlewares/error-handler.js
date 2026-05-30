"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const logger_1 = require("../config/logger");
const app_error_1 = require("../errors/app-error");
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.originalUrl} not found`,
        },
    });
}
function errorHandler(error, req, res, _next) {
    const appError = error instanceof app_error_1.AppError ? error : new app_error_1.AppError('Unexpected server error');
    logger_1.logger.error({
        err: error,
        requestId: req.headers['x-request-id'],
        path: req.originalUrl,
        method: req.method,
    }, appError.message);
    res.status(appError.statusCode).json({
        success: false,
        error: {
            code: appError.code,
            message: appError.message,
            details: appError.details,
        },
    });
}
