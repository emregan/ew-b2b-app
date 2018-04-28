import { Request, Response, NextFunction, RequestHandler } from "express";
import * as logger from "../services/logger";
import Aspxauth = require("aspxauth");

interface User {
  userName: string;
  uUid: string;
}

// split a string like userName:jdoe,uUid:xxxxxxxxxx
// to a user object
const parseCustomDataToUser = (customData: string): User|undefined => {
  const data: { [index: string]: string } = customData.split(/,/)
    .map(x => x.split(/:/))
    .reduce((data: any, item: [string, string]) => {
      data[item[0]] = item[1];
      return data;
    }, {});

  if (typeof data.uUid === "undefined") {
    return undefined;
  }

  return {
    uUid: data.uUid,
    userName: data.userName || "",
  };
};

const middleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = undefined;

    if (typeof req.cookies["cookiepersona"] === "undefined" || req.cookies["cookiepersona"] == "") {
      // remove .ASPXAUTH cookie if cookiepersona is empty
      req.cookies[".ASPXAUTH"] = "";
      res.clearCookie(".ASPXAUTH");
    } else if (typeof req.cookies[".ASPXAUTH"] !== "undefined") {
      const cookie = req.cookies[".ASPXAUTH"];

      const aspxauth = Aspxauth({
        validationKey: process.env.DOTNET_VALIDATION_KEY || "",
        decryptionIV: process.env.DOTNET_DECRYPTION_IV || "",
        decryptionKey: process.env.DOTNET_DECRYPTION_KEY || "",
      });

      try {
        const decrypted = aspxauth.decrypt(cookie);

        if (decrypted) {
          if (typeof decrypted.customData !== "undefined" && decrypted.customData) {
            res.locals.user = parseCustomDataToUser(decrypted.customData);
            logger.info(`Decrypted ASPXAUTH cookie: ${JSON.stringify(decrypted)}`);
          } else {
            logger.error(`Decrypted ASPXAUTH cookie without customData: ${JSON.stringify(decrypted)}`);
          }
        } else {
          logger.error(`Decrypted ASPXAUTH cookie is empty [${cookie}]`);
        }
      } catch (err) {
        logger.error(`Could not decrypt .ASPXAUTH cookie [${cookie}]: ${err.toString()}`, {stack: err.stack});
      }
    }

    next();
  };
};

export = middleware;
