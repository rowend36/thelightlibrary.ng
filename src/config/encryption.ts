export const algorithm = "AES-CBC";
const secretKey = process.env.COOKIE_SECRET!.slice(0, 32); // 32 bytes for AES-256

export async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: algorithm, length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
