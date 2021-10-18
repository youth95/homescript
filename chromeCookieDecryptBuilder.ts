import { Aes } from "https://deno.land/x/crypto@v0.10.0/aes.ts";
import {
  Cbc,
  Padding,
} from "https://deno.land/x/crypto@v0.10.0/block-modes.ts";

import { pbkdf2Sync } from "https://deno.land/std@0.111.0/node/_crypto/pbkdf2.ts";

export function chromeCookieDecryptBuilder(chromePassword: string) {
  const td = new TextDecoder();
  const iv = new Uint8Array(16).fill(0x20);
  const key = pbkdf2Sync(chromePassword, "saltysalt", 1003, 16);
  return (encryptedData: Uint8Array) => {
    const decipher = new Cbc(Aes, key, iv, Padding.LAST_BYTE);
    const result = decipher.decrypt(encryptedData.slice(3));
    return td.decode(result);
  };
}
