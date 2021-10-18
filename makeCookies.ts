import { chromeCookieDecryptBuilder } from "./chromeCookieDecryptBuilder.ts";
import { DB } from "https://deno.land/x/sqlite@v3.1.1/mod.ts";

export function makeCookies(
  hostKey: string,
  password?: string,
  // deno-lint-ignore no-inferrable-types
  cookiesFile: string =
    "/Users/admin/Library/ApplicationSupport/Google/Chrome/Default/Cookies",
) {
  const decrypt = chromeCookieDecryptBuilder(
    Deno.env.get("CP") ?? password ?? "",
  );
  const db = new DB(cookiesFile);
  const cookies: Record<string, string> = {};
  for (
    const [name, encryptedValue] of db.query(
      `select name,encrypted_value from cookies where host_key='${hostKey}'`,
    )
  ) {
    cookies[name as string] = decrypt(encryptedValue as Uint8Array);
  }
  return Object.entries(cookies).map(([key, value]) => `${key}=${value};`).join(
    " ",
  );
}
