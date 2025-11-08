import { DEV_ENVIRONMENT } from "./env";

const logger = (...args: any[]) => {
  if (DEV_ENVIRONMENT !== "production") {
    // eslint-disable-next-line
    console.log(...args);
  }
  return false;
};

export default logger;
