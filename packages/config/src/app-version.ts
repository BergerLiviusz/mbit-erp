/** Központi alkalmazásverzió – GINOP audit és UI egyetlen forrása. */
export const APP_VERSION = '1.0.1a';
export const APP_NAME = 'MBIT ERP';
export const APP_VENDOR = 'MB-IT Kft.';

export type AppEnvironment = 'development' | 'staging' | 'production';

export function getAppEnvironment(): AppEnvironment {
  const env = (process.env.NODE_ENV || '').toLowerCase();
  if (env === 'development') return 'development';
  if (process.env.APP_ENV === 'staging') return 'staging';
  return 'production';
}

export function formatVersionLabel(options?: {
  version?: string;
  packageEdition?: string;
  environment?: AppEnvironment;
  buildSha?: string | null;
}): string {
  const version = options?.version ?? APP_VERSION;
  const edition = options?.packageEdition;
  const env = options?.environment ?? getAppEnvironment();
  const sha = options?.buildSha;

  let label = `${APP_NAME} v${version}`;
  if (edition) label += ` – ${edition}`;
  if (env === 'development') label += ' [dev]';
  else if (env === 'staging') label += ' [staging]';
  if (sha) label += ` (${sha.slice(0, 7)})`;
  return label;
}

export function getVersionInfoFromEnv(): {
  version: string;
  buildSha: string | null;
  buildDate: string | null;
  packageId: string;
  environment: AppEnvironment;
} {
  return {
    version: process.env.APP_VERSION || APP_VERSION,
    buildSha: process.env.BUILD_SHA || process.env.GITHUB_SHA || null,
    buildDate: process.env.BUILD_DATE || null,
    packageId: process.env.ERP_PACKAGE || process.env.VITE_ACTIVE_PACKAGE || 'full',
    environment: getAppEnvironment(),
  };
}
