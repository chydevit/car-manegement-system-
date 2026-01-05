const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "change_this_secret";

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function rolesAllowed(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

function adminRequired(req, res, next) {
  authRequired(req, res, (err) => {
    if (err) return next(err);
    rolesAllowed("admin")(req, res, next);
  });
}

module.exports = { authRequired, rolesAllowed, adminRequired, SECRET };
