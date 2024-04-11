const express = require("express");
const authCtr = require("./auth.service");

const authRouter = express.Router();
const authMiddleware = require("../../../middleware/auth.middleware");
const signinSchema = require('./dto/input/signin.input.json');
const newTokenSchema = require('./dto/input/new_token.input.json');
const signupSchema = require('./dto/input/signup.input.json');

const { validateSchema, ajv } = require('../../../lib/shared/src/validation/validation');

ajv.addSchema(signinSchema, 'signin');
ajv.addSchema(newTokenSchema, 'new_token');
ajv.addSchema(signupSchema, 'signup');

authRouter.post("/signin", validateSchema('signin'), authCtr.login);
authRouter.post("/signin/new_token", validateSchema('signin'), authCtr.refreshTokens);
authRouter.post("/signup", validateSchema('signup'), authCtr.register);
authRouter.get("/info", authMiddleware, authCtr.userInfo);
// authRouter.get("/logout", authMiddleware, authCtr.userInfo);

module.exports = authRouter;
