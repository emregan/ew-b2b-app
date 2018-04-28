"use strict";

import * as winston from "winston";
import clfDate = require("clf-date");

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: process.env.NODE_ENV !== "production",
      timestamp: clfDate,
    }),
  ]
});

export = logger;
