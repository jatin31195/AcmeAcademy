const errorHandler = (err, req, res, next) => {
  console.error("💥 Error occurred:", {
    message: err.message,
    reason: err.reason || undefined,
    stack: err.stack
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (res && typeof res.status === "function" && typeof res.json === "function") {
    res.status(statusCode).json({
      success: false,
      message,
      reason: err.reason || undefined
    });
  } else {
    console.error("No response object available. Error:", message, "Reason:", err.reason);
  }

  if (typeof next === "function") next(err);
};
export default errorHandler;