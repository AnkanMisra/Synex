import { Router, Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import Joi from 'joi';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Valid OpenRouter models
const VALID_MODELS = [
  'openai/gpt-oss-20b:free',
  'openai/gpt-3.5-turbo',
  'openai/gpt-4',
  'anthropic/claude-3-haiku',
  'meta-llama/llama-3.1-8b-instruct:free',
  'microsoft/wizardlm-2-8x22b',
  'google/gemma-7b-it:free'
];

// Model validation function
const validateModel = (model: string): boolean => {
  return VALID_MODELS.includes(model);
};

// Validation schemas
const chatRequestSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('system', 'user', 'assistant').required(),
      content: Joi.string().required()
    })
  ).required().min(1),
  model: Joi.string().optional().default(process.env.DEFAULT_MODEL || 'openai/gpt-oss-20b:free'),
  max_tokens: Joi.number().optional().min(1).max(4000),
  temperature: Joi.number().optional().min(0).max(2)
});

// Middleware to extract and validate API key
const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Missing or invalid Authorization header. Expected: Bearer <api_key>', 401);
    }
    
    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!apiKey) {
      throw createError('API key is required', 401);
    }
    
    // Store API key in request for later use
    (req as any).apiKey = apiKey;
    
    next();
  } catch (error) {
    next(error);
  }
};

// Validate OpenRouter API key by making a test request
const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const openai = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });
    
    // Make a minimal test request
    await openai.chat.completions.create({
      model: process.env.DEFAULT_MODEL || 'openai/gpt-oss-20b:free',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });
    
    return true;
  } catch (error: any) {
    logger.warn('API key validation failed:', {
      error: error.message,
      status: error.status
    });
    return false;
  }
};

// POST /api/v1/llm/chat - Chat completion endpoint
router.post('/chat', validateApiKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { error, value } = chatRequestSchema.validate(req.body);
    if (error) {
      throw createError(`Validation error: ${error.details[0].message}`, 400);
    }
    
    const { messages, model, max_tokens, temperature } = value;
    const apiKey = (req as any).apiKey;
    
    // Validate model
    if (!validateModel(model)) {
      throw createError(
        `Invalid model '${model}'. Valid models include: ${VALID_MODELS.join(', ')}. We recommend using 'openai/gpt-oss-20b:free' for free usage.`,
        400
      );
    }
    
    // Create OpenAI client with user's API key
    const openai = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        ...(process.env.SITE_URL && { 'HTTP-Referer': process.env.SITE_URL }),
        ...(process.env.SITE_NAME && { 'X-Title': process.env.SITE_NAME })
      }
    });
    
    logger.info('Making OpenRouter request:', {
      model,
      messageCount: messages.length,
      maxTokens: max_tokens
    });
    
    // Make request to OpenRouter
    const completion = await openai.chat.completions.create({
      model,
      messages,
      ...(max_tokens && { max_tokens }),
      ...(temperature !== undefined && { temperature })
    });
    
    logger.info('OpenRouter request successful:', {
      model,
      usage: completion.usage
    });
    
    // Return the completion
    res.status(200).json({
      success: true,
      data: {
        message: completion.choices[0]?.message,
        usage: completion.usage,
        model: completion.model
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    logger.error('OpenRouter request failed:', {
      error: error.message,
      status: error.status,
      code: error.code
    });
    
    // Handle OpenRouter-specific errors
    if (error.status === 401) {
      next(createError('Invalid OpenRouter API key', 401));
    } else if (error.status === 429) {
      next(createError('Rate limit exceeded. Please try again later.', 429));
    } else if (error.status === 400) {
      // Check if it's a model-related error
      if (error.message && error.message.includes('not a valid model')) {
        next(createError(
          `Invalid model. ${error.message}. Valid models include: ${VALID_MODELS.join(', ')}. We recommend using 'openai/gpt-oss-20b:free' for free usage.`,
          400
        ));
      } else {
        next(createError(`OpenRouter API error: ${error.message}`, 400));
      }
    } else if (error.message && error.message.includes('Invalid model')) {
      // Handle our custom model validation errors
      next(createError(error.message, 400));
    } else {
      next(createError('Failed to process LLM request', 500));
    }
  }
});

// POST /api/v1/llm/validate - Validate API key endpoint
router.post('/validate', validateApiKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = (req as any).apiKey;
    
    logger.info('Validating OpenRouter API key');
    
    const isValid = await testApiKey(apiKey);
    
    if (isValid) {
      res.status(200).json({
        success: true,
        message: 'API key is valid',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid API key',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    next(error);
  }
});

export { router as llmRouter };