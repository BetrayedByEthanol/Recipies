export function validateAuthConfig(env: NodeJS.ProcessEnv = process.env): void {
  const isProdLike = env.NODE_ENV === 'production' || env.NODE_ENV === 'staging';
  const allowUnauthenticatedWrites = env.ALLOW_UNAUTHENTICATED_WRITES === 'true';
  const adminToken = env.ADMIN_TOKEN?.trim();

  if (isProdLike && !adminToken && !allowUnauthenticatedWrites) {
    throw new Error(
      'ADMIN_TOKEN is required in production/staging unless ALLOW_UNAUTHENTICATED_WRITES=true is explicitly set.',
    );
  }
}
