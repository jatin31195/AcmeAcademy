export const createError = (message, statusCode = 500, reason) => {
  return {
    message,
    statusCode,
    reason,
    isOperational: true,
    stack: new Error().stack
  };
};
