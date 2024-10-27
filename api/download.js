import { decrypt } from "../dist/src/utils/encryption";

export const config = {
  runtime: "edge", // Ensures this is treated as an Edge Function
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const token = url.pathname.split("/")[2]; // Extract the token from the URL
    const title = url.pathname.split("/")[3]; // Extract the title from the URL

    const decryptedToken = JSON.parse(await decrypt(token));

    // Check if token is expired
    if (decryptedToken.lifetimeMs + decryptedToken.issueTimeMs < Date.now()) {
      return new Response(JSON.stringify({ error: "Token has expired." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the resource from the token URL
    const resourceResponse = await fetch(decryptedToken.url);

    // Set headers for the response
    const headers = new Headers();
    for (const [key, value] of resourceResponse.headers.entries()) {
      headers.set(key, value);
    }

    // Return the streaming response
    return new Response(resourceResponse.body, {
      status: resourceResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Error processing download:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
