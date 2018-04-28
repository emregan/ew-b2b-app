interface Options {
  validationKey: string;
  decryptionKey: string;
  decryptionIV?: string;
  validationMethod?: string;
  decryptionMethod?: string;
  ticketVersion?: number;
  validateExpiration?: boolean;
  encryptAsBuffer?: boolean;
  defaultTTL?: number;
  defaultPersistent?: number;
  defaultCookiePath?: string;
}

interface Payload {
  name: string;
  ticketVersion?: number;
  issueDate?: Date;
  expirationDate?: Date;
  isPersistent?: boolean;
  customData?: string|undefined;
  cookiePath?: string;
}

interface Auth {
  encrypt(payload: Payload): string;
  decrypt(cookie: string): Payload;
}

declare function Aspxauth(options: Options): Auth;

export = Aspxauth;
