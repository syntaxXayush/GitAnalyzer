"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
function validateRequest(schemaMap) {
    return (req, res, next) => {
        try {
            const validated = {};
            if (schemaMap.body) {
                validated.body = schemaMap.body.parse(req.body);
            }
            if (schemaMap.query) {
                validated.query = schemaMap.query.parse(req.query);
            }
            if (schemaMap.params) {
                validated.params = schemaMap.params.parse(req.params);
            }
            res.locals.validated = validated;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new app_error_1.ValidationError('Request validation failed', error.flatten()));
                return;
            }
            next(error);
        }
    };
}
