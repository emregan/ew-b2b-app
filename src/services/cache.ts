"use strict";

import * as cacheManager from "cache-manager";
import * as redisStore from "cache-manager-ioredis";
import * as logger from "./logger";

interface Cache {
  get: (key: string, callback: (err: any, result: any) => any) => void;
  set: (key: string, value: any, ttl: number) => void;
}

class NullCache implements Cache {
  get(key: string, callback: (err: any, result: any) => any): void {
    callback(undefined, undefined);
  }

  set(key: string, value: any, ttl: number): void {
  }
}

let cacheInstance: Cache;

const makeCache = (): Cache => {
  try {
    return makeRedisCache();
  } catch (e) {
    logger.error(`Could not load redis: ${e.message}`);

    return makeNullCache();
  }
};

const makeNullCache = (): Cache => {
  return new NullCache();
};

const makeRedisCache = (): Cache => {
  return cacheManager.caching({
    store: redisStore,
    ttl: 31536000,
    clusterConfig: {
      nodes: [
        {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }
      ],
    },
  });
};

const cache = (): Cache => {
  return cacheInstance || (cacheInstance = makeCache());
};

export const get = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cache().get(key, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const set = (key: string, value: any, ttl: number = 60): void => {
  const options: any = {ttl: ttl};

  cache().set(key, value, options);
};
