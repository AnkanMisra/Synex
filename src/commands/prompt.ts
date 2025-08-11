// main prompt command where users send messages to ai
// todo connect this to actual ai models
export default function promptCommand(message: string, options: { model?: string }) {
  const model = options.model || 'gpt-oss-2b';
  console.log(`Message: ${message}`);
  console.log(`Model: ${model}`);
}