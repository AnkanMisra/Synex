// auth class handles user authentication and sessions
// todo implement actual oauth and token management
export class Auth {
  constructor() {
    // basic auth setup
  }

  // main login method
  async login(): Promise<boolean> {
    // todo implement real login flow
    return true;
  }

  // logout and clear session
  async logout(): Promise<void> {
    // todo clear tokens and session data
  }
}

// checks if user is currently logged in
export function isAuthenticated(): boolean {
  return false; // todo check actual auth state
}

// free api login flow using convex auth
export async function loginWithFreeAPI(): Promise<boolean> {
  console.log('\nInitiating free API login...');
  console.log('This would redirect to authentication flow.');
  // todo implement convex oauth flow
  return true;
}

// api key login for openrouter or convex
export async function loginWithAPIKey(): Promise<boolean> {
  console.log('\nInitiating API key login...');
  console.log('This would prompt for OpenRouter/Convex API key.');
  // todo implement api key validation and storage
  return true;
}

export default Auth;
