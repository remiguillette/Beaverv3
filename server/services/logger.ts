
export class Logger {
  static info(message: string, meta: object = {}) {
    console.log(`[INFO] ${message}`, meta);
  }

  static error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);
  }

  static warn(message: string, meta: object = {}) {
    console.warn(`[WARN] ${message}`, meta);
  }
}
