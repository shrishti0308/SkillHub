/**
 * Standard response format for API calls
 */
class ApiResponse {
  constructor(success, message, data = null, error = null) {
    this.success = success;
    if (message) this.message = message;

    // If data is a mongoose document, get the clean _doc version
    if (data && data._doc) {
      const key = Object.keys(arguments[2])[0];
      this[key] = data._doc;
    }
    // If data is a regular object
    else if (data) {
      const key = Object.keys(data)[0];
      this[key] = data[key];
    }

    if (error) this.error = error;
  }
}

/**
 * Success response handler
 */
module.exports.apiSuccess = (
  res,
  message = "Success",
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json(new ApiResponse(true, message, data));
};

/**
 * Error response handler
 */
module.exports.apiError = (
  res,
  message = "Internal Server Error",
  error = null,
  statusCode = 500
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(false, message, null, error));
};

/**
 * Not found response handler
 */
module.exports.apiNotFound = (res, message = "Resource not found") => {
  return res.status(404).json(new ApiResponse(false, message));
};

/**
 * Bad request response handler
 */
module.exports.apiBadRequest = (res, message = "Bad Request", error = null) => {
  return res.status(400).json(new ApiResponse(false, message, null, error));
};

/**
 * Unauthorized response handler
 */
module.exports.apiUnauthorized = (res, message = "Unauthorized access") => {
  return res.status(401).json(new ApiResponse(false, message));
};

/**
 * Forbidden response handler
 */
module.exports.apiForbidden = (res, message = "Access forbidden") => {
  return res.status(403).json(new ApiResponse(false, message));
};

/**
 * Validation error response handler
 */
module.exports.apiValidationError = (res, errors) => {
  return res
    .status(422)
    .json(new ApiResponse(false, "Validation failed", null, errors));
};
