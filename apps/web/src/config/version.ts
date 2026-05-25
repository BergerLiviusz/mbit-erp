import { APP_NAME, APP_VERSION, formatVersionLabel } from '@mbit-erp/config';
import { getPackageDisplayInfo } from './modules';

export { APP_NAME, APP_VERSION };

export function getBuildMeta() {
  return {
    buildSha: import.meta.env.VITE_BUILD_SHA || null,
    buildDate: import.meta.env.VITE_BUILD_DATE || null,
    environment: import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production'),
  };
}

export function getClientVersionLabel(): string {
  const pkg = getPackageDisplayInfo();
  const { buildSha } = getBuildMeta();
  return formatVersionLabel({
    version: import.meta.env.VITE_APP_VERSION || APP_VERSION,
    packageEdition: pkg.editionLabel,
    environment: import.meta.env.DEV ? 'development' : 'production',
    buildSha: buildSha || undefined,
  });
}

export function getShortVersionLine(): string {
  return `${APP_NAME} v${import.meta.env.VITE_APP_VERSION || APP_VERSION}`;
}
