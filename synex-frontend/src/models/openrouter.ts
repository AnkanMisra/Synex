// openrouter class handles api calls to openrouter models
// todo implement actual http requests and api key handling
export class OpenRouter {
  constructor() {
    // setup for openrouter api client
  }

  // sends prompt to openrouter and gets response
  async query(prompt: string): Promise<string> {
    // todo make actual api call to openrouter
    return 'OpenRouter response placeholder';
  }
}

export default OpenRouter;