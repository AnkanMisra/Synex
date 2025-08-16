"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmRouter = void 0;
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
exports.llmRouter = router;
const VALID_MODELS = [
    'openai/gpt-oss-20b:free',
    'openai/gpt-3.5-turbo',
    'openai/gpt-4',
    'anthropic/claude-3-haiku',
    'meta-llama/llama-3.1-8b-instruct:free',
    'microsoft/wizardlm-2-8x22b',
    'google/gemma-7b-it:free'
];
const validateModel = (model) => {
    return VALID_MODELS.includes(model);
};
const chatRequestSchema = joi_1.default.object({
    messages: joi_1.default.array().items(joi_1.default.object({
        role: joi_1.default.string().valid('system', 'user', 'assistant').required(),
        content: joi_1.default.string().required()
    })).required().min(1),
    model: joi_1.default.string().optional().default(process.env.DEFAULT_MODEL || 'openai/gpt-oss-20b:free'),
    max_tokens: joi_1.default.number().optional().min(1).max(4000),
    temperature: joi_1.default.number().optional().min(0).max(2)
});
const validateApiKey = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw (0, errorHandler_1.createError)('Missing or invalid Authorization header. Expected: Bearer <api_key>', 401);
        }
        const apiKey = authHeader.substring(7);
        if (!apiKey) {
            throw (0, errorHandler_1.createError)('API key is required', 401);
        }
        req.apiKey = apiKey;
        next();
    }
    catch (error) {
        next(error);
    }
};
const testApiKey = async (apiKey) => {
    try {
        const openai = new openai_1.default({
            baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
        });
        await openai.chat.completions.create({
            model: process.env.DEFAULT_MODEL || 'openai/gpt-oss-20b:free',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1
        });
        return true;
    }
    catch (error) {
        logger_1.logger.warn('API key validation failed:', {
            error: error.message,
            status: error.status
        });
        return false;
    }
};
router.post('/chat', validateApiKey, async (req, res, next) => {
    try {
        const { error, value } = chatRequestSchema.validate(req.body);
        if (error) {
            throw (0, errorHandler_1.createError)(`Validation error: ${error.details[0].message}`, 400);
        }
        const { messages, model, max_tokens, temperature } = value;
        const apiKey = req.apiKey;
        if (!validateModel(model)) {
            throw (0, errorHandler_1.createError)(`Invalid model '${model}'. Valid models include: ${VALID_MODELS.join(', ')}. We recommend using 'openai/gpt-oss-20b:free' for free usage.`, 400);
        }
        const openai = new openai_1.default({
            baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
            defaultHeaders: {
                ...(process.env.SITE_URL && { 'HTTP-Referer': process.env.SITE_URL }),
                ...(process.env.SITE_NAME && { 'X-Title': process.env.SITE_NAME })
            }
        });
        logger_1.logger.info('Making OpenRouter request:', {
            model,
            messageCount: messages.length,
            maxTokens: max_tokens
        });
        const completion = await openai.chat.completions.create({
            model,
            messages,
            ...(max_tokens && { max_tokens }),
            ...(temperature !== undefined && { temperature })
        });
        logger_1.logger.info('OpenRouter request successful:', {
            model,
            usage: completion.usage
        });
        res.status(200).json({
            success: true,
            data: {
                message: completion.choices[0]?.message,
                usage: completion.usage,
                model: completion.model
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        logger_1.logger.error('OpenRouter request failed:', {
            error: error.message,
            status: error.status,
            code: error.code
        });
        if (error.status === 401) {
            next((0, errorHandler_1.createError)('Invalid OpenRouter API key', 401));
        }
        else if (error.status === 429) {
            next((0, errorHandler_1.createError)('Rate limit exceeded. Please try again later.', 429));
        }
        else if (error.status === 400) {
            if (error.message && error.message.includes('not a valid model')) {
                next((0, errorHandler_1.createError)(`Invalid model. ${error.message}. Valid models include: ${VALID_MODELS.join(', ')}. We recommend using 'openai/gpt-oss-20b:free' for free usage.`, 400));
            }
            else {
                next((0, errorHandler_1.createError)(`OpenRouter API error: ${error.message}`, 400));
            }
        }
        else if (error.message && error.message.includes('Invalid model')) {
            next((0, errorHandler_1.createError)(error.message, 400));
        }
        else {
            next((0, errorHandler_1.createError)('Failed to process LLM request', 500));
        }
    }
});
router.post('/validate', validateApiKey, async (req, res, next) => {
    try {
        const apiKey = req.apiKey;
        logger_1.logger.info('Validating OpenRouter API key');
        const isValid = await testApiKey(apiKey);
        if (isValid) {
            res.status(200).json({
                success: true,
                message: 'API key is valid',
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Invalid API key',
                timestamp: new Date().toISOString()
            });
        }
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=llm.js.map