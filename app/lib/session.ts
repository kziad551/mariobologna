import type {HydrogenSession} from '@shopify/hydrogen';
import {
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from '@shopify/remix-oxygen';

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class AppSession implements HydrogenSession {
  #sessionStorage;
  #session;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    const host = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Get the domain without www for production
    const domain = isProduction && !isLocalhost
      ? '.' + host.replace('www.', '')
      : undefined;

    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: isLocalhost ? 'lax' : 'strict',
        secrets,
        secure: isProduction || host.includes('https'),
        maxAge: 60 * 60 * 24 * 30, // 30 days
        domain: domain,
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    return this.#session.unset;
  }

  get set() {
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  async commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }

  // Add helper methods for OAuth state management
  async getOAuthState() {
    return this.get('oauth2:state');
  }

  async setOAuthState(state: string) {
    this.set('oauth2:state', state);
    await this.commit();
  }

  async clearOAuthState() {
    this.unset('oauth2:state');
    this.unset('oauth2:returnTo');
    this.unset('oauth2:error');
    this.unset('oauth2:token');
    await this.commit();
  }
}
