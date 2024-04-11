const Ajv = require('ajv');

const response = require('../http/response');

const ajv = new Ajv({ allErrors: true });

const errorResponse = (schemaErrors) => {
  const errors = {};
  schemaErrors.forEach((error) => {
    const key = error.dataPath ? error.dataPath.match(/[^.]+$/)[0] : '/';
    let { message } = error;
    if (error.params.additionalProperty) {
      message += ` \'${error.params.additionalProperty}\'`;
    }
    errors[key] ? errors[key].push(message) : errors[key] = [message];
  });
  return {
    message: 'Validation error',
    error: errors,
  };
};

const validate = (schemaName, data) => {
  const valid = ajv.validate(schemaName, data);
  if (!valid) {
    return errorResponse(ajv.errors);
  }
  return false;
};

const validateSchema = (schemaName, schemaDataKey = 'body') => {
  return (req, res, next) => {
    console.log(req.file);
    const error = validate(schemaName, req[schemaDataKey]);
    console.log(error,"errorerror");
    if (error) {
      const status = response.status.UNPROCESSABLE_ENTITY;
      const data = response.dispatch({
        error: error.error,
        code: status,
      });
      return res.status(status).json(data);
    }
    return next();
  };
};


module.exports = {
  validateSchema, validate, ajv
};