import * as logger from "./logger.js";

export const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  next(error);
};
