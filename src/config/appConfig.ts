import appConfigJson from '../../content/app-config.json';

export type AppConfig = typeof appConfigJson;

export const appConfig: AppConfig = appConfigJson;
