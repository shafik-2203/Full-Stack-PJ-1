
export function validateTokenEndpoint(req: any, res: any) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        success: false,
        message: "No token provided",
        details: {
          hasAuthHeader: !!authHeader,
          authHeader: authHeader,
        },
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.json({
        success: false,
        message: "Token validation failed",
        details: {
          tokenLength: token.length,
          tokenStart: token.substring(0, 20),
        },
      });
    }

    return res.json({
      success: true,
      message: "Token is valid",
      user: decoded,
      details: {
        tokenLength: token.length,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Validation error",
      error: error.message,
    });
  }
}