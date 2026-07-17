export const SuccessResponse = <T>(data: T) => {
  return {
    success: true,
    data: data,
    error: null,
  };
};

export const ErrorResponse = (error: String) => {
  return {
    success: false,
    data: null,
    error: error,
  };
};
