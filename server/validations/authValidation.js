const Joi = require("joi");

//register user schema
const registerSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$"))
    .required(),

  repeat_password: Joi.ref("password"),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "org"] },
  }),
}).options({ abortEarly: false }); //get all possible errors of validation

//login schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    })
    .required(),

  password: Joi.string().required(),
}).options({ abortEarly: false }); //get all possible errors of validation

//forget password email schema
const resetPwdSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    })
    .required(),
}).options({ abortEarly: false }); //get all possible errors of validation

//register user schema
const newPwdSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$"))
    .required(),

  repeat_password: Joi.ref("password"),
}).options({ abortEarly: false }); //get all possible errors of validation

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      // Handle validation error
      console.log(error.message);

      res.status(400).json({ status: "unsucessful", errors: error.details });
    } else {
      // console.log(value);
      // Data is valid, proceed to the next middleware
      next();
    }
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  resetPwdSchema,
  newPwdSchema,
  validationMiddleware,
};
