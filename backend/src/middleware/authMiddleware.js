import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // Debugging
    console.log("SERVER TIME:", new Date().toISOString());

    const decoded = jwt.decode(token);

    console.log(
      "TOKEN EXPIRY:",
      decoded?.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : "No expiry"
    );

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN VERIFIED SUCCESSFULLY");

    req.user = verified;
    next();

  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

export default protect;