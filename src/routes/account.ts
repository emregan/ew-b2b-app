import * as express from "express";
const router = express.Router();

import * as account from "../controllers/account";

router.get("/", account.index);
router.get("/login", account.login);
router.get("/profile", account.profile);
router.get("/register", account.register);

export {
  router
};