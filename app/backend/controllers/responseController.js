exports.failedOperation = (statusCode, messageText, res) => {
  if (!statusCode) statusCode = 500;
  res.status(statusCode).json({
    status: 'failed',
    messageText,
  });
};

exports.successfulOperation = (statusCode, data, res) => {
  if (!statusCode) statusCode = 200;
  res.status(statusCode).json({
    status: 'success',
    data,
  });
};
