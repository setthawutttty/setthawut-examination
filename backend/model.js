const responseFormat = (err, code, data, message) => {
  return {
    status: err,
    code: code,
    data: data,
    message: message,
  };
};
module.exports = {
  responseFormat,
};
