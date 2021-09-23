const joi = require("joi");

const validateRegister = (user) => {
  const schema = joi.object({
    name: joi.string().min(4).max(30).required(),
    email: joi.string().email().max(30).required(),
    password: joi.string().min(8).max(30).required(),
  });

  return schema.validate(user);
};

module.exports = validateRegister;
