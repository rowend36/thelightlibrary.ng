import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { decrypt } from "../utils/encryption";
import { Readable } from "node:stream";

const downloadRoute = Router();

downloadRoute.get("/:token/:title", async (req, res) => {
  try {
    // Decrypt and parse the token
    const token = JSON.parse(await decrypt(req.params.token));

    // Validate the token lifetime
    if (token.lifetimeMs + token.issueTimeMs < Date.now()) {
      return res.status(400).json({ error: "Token has expired." });
    }

    // Fetch the resource from the token URL
    const response = await fetch(token.url);

    // Set the status of the response
    res.status(response.status);

    // Forward all headers from the fetched resource to the response
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // Stream the fetched body directly to the response
    Readable.fromWeb(response.body as any).pipe(res);
  } catch (error) {
    console.error("Error processing download:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default downloadRoute;
