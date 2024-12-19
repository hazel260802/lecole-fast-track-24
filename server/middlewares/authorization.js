import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

/**
 * Middleware for authorizing users and attaching token information to the request.
 */
export const authorization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    // If no token is provided, treat as a non-authenticated user
    req.user = { username: "N/A", roles: "non-authenticated" };
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the token
    req.user = { username: decoded.username, roles: decoded.roles }; // Attach user info
    console.log(req.user);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
