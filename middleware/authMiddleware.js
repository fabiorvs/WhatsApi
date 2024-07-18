const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: "error", message: "Acesso negado: token inválido" });
      }
      req.user = user;
      next();
    });
  } else {
    res
      .status(401)
      .json({ status: "error", message: "Acesso negado: token não fornecido" });
  }
};

module.exports = authenticateJWT;
