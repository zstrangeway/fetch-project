/**
 * Lame implementation of a logging service.
 * This is just a convenient way to selectively suppress debugging messages.
 * Ideally this would be more robust and potentially send telemetry data.
 */

export enum AppStage {
  Local = 'local',
  Dev = 'dev',
  PreProd = 'preprod',
  Prod = 'prod',
}

export enum LogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Error = 'ERROR',
}

const appStage: AppStage = import.meta.env.VITE_APP_STAGE ?? AppStage.Prod;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (level: LogLevel, message?: any, ...optionalParams: any[]) => {
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams);
  }

  switch (appStage) {
    case AppStage.Local:
      // Always print
      break;
    case AppStage.Dev:
      if (level === LogLevel.Debug) return;
      // Only print errors and info
      break;
    case AppStage.PreProd || AppStage.Prod:
      // Only print errors
      if (level !== LogLevel.Error) return;
      break;
    default:
      return;
  }

  // eslint-disable-next-line no-console
  console.log(message, ...optionalParams);
};
