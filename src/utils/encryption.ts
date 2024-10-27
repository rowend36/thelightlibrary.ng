import { algorithm, getKey } from "../config/encryption";

// Encrypt a URL
export async function encrypt(url: string) {
  const iv = crypto.getRandomValues(new Uint8Array(16)); // 16-byte IV for AES-CBC
  const key = await getKey();
  const encrypted = await crypto.subtle.encrypt(
    { name: algorithm, iv },
    key,
    new TextEncoder().encode(url),
  );

  // Return the encrypted data along with the IV (in base64)
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
}

// Decrypt an encrypted URL
export async function decrypt(encryptedUrl: string) {
  const [ivBase64, encryptedBase64] = encryptedUrl.split(":");
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0),
  );

  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: algorithm, iv },
    key,
    encryptedBytes,
  );

  return new TextDecoder().decode(decrypted);
}
