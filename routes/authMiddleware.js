const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Extract the token from 'Bearer <token>'
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = { id: decoded.id, role: decoded.role }; // Correctly set req.user with id and role
    next();
  });
};

module.exports = verifyToken;
