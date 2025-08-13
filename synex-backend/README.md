# Synex Backend

TypeScript/Node.js backend for Synex with OpenRouter LLM integration.

## Features

- **OpenRouter Integration**: Secure API key handling for LLM requests
- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Type-safe development
- **Security**: Helmet, CORS, and input validation
- **Logging**: Winston-based structured logging
- **Health Checks**: Built-in health monitoring

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### LLM Operations
- **POST** `/api/v1/llm/chat` - Chat completions with OpenRouter
- **POST** `/api/v1/llm/validate` - Validate OpenRouter API key

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development:**
   ```bash
   pnpm run dev
   ```

4. **Production:**
   ```bash
   pnpm run build
   pnpm start
   ```

## API Usage

### Chat Completion

```bash
curl -X POST http://localhost:3000/api/v1/llm/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "model": "openai/gpt-oss-20b:free"
  }'
```

### API Key Validation

```bash
curl -X POST http://localhost:3000/api/v1/llm/validate \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `OPENROUTER_BASE_URL` | OpenRouter API URL | `https://openrouter.ai/api/v1` |
| `DEFAULT_MODEL` | Default LLM model | `openai/gpt-oss-20b:free` |
| `SITE_URL` | Site URL for OpenRouter rankings | - |
| `SITE_NAME` | Site name for OpenRouter rankings | - |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | CORS origin | `*` |

## Security

- **No API Key Storage**: User API keys are never stored on the server
- **Request Validation**: All inputs are validated using Joi
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing
- **Error Handling**: Structured error responses without sensitive data

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run linting
pnpm run lint

# Run tests
pnpm test
```

## Project Structure

```
src/
├── routes/
│   ├── health.ts      # Health check endpoints
│   └── llm.ts         # LLM/OpenRouter endpoints
├── middleware/
│   └── errorHandler.ts # Error handling middleware
├── utils/
│   └── logger.ts      # Winston logger configuration
└── app.ts             # Express app setup
```