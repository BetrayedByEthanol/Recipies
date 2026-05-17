import { describe, it, expect } from 'vitest';
import { validateAuthConfig } from '../config';

describe('validateAuthConfig', () => {
  it('throws when NODE_ENV=production without ADMIN_TOKEN', () => {
    expect(() => validateAuthConfig({ NODE_ENV: 'production' } as NodeJS.ProcessEnv)).toThrow(
      'ADMIN_TOKEN is required in production/staging unless ALLOW_UNAUTHENTICATED_WRITES=true is explicitly set.',
    );
  });

  it('throws when NODE_ENV=staging without ADMIN_TOKEN', () => {
    expect(() => validateAuthConfig({ NODE_ENV: 'staging' } as NodeJS.ProcessEnv)).toThrow(
      'ADMIN_TOKEN is required in production/staging unless ALLOW_UNAUTHENTICATED_WRITES=true is explicitly set.',
    );
  });

  it('does not throw when NODE_ENV=production with ADMIN_TOKEN', () => {
    expect(() =>
      validateAuthConfig({ NODE_ENV: 'production', ADMIN_TOKEN: 'secret-token' } as NodeJS.ProcessEnv),
    ).not.toThrow();
  });

  it('does not throw when NODE_ENV=production with ALLOW_UNAUTHENTICATED_WRITES=true', () => {
    expect(() =>
      validateAuthConfig({ NODE_ENV: 'production', ALLOW_UNAUTHENTICATED_WRITES: 'true' } as NodeJS.ProcessEnv),
    ).not.toThrow();
  });

  it('does not throw when NODE_ENV=development without ADMIN_TOKEN', () => {
    expect(() => validateAuthConfig({ NODE_ENV: 'development' } as NodeJS.ProcessEnv)).not.toThrow();
  });
});
