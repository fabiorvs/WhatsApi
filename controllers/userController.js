const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({
              status: "error",
              message: "Erro ao criar usuário: " + err.message,
            });
        }
        res
          .status(201)
          .json({
            status: "success",
            message: "Usuário criado com sucesso!",
            userId: this.lastID,
          });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Erro ao criar usuário: " + error.message,
      });
  }
};

exports.getUsers = (req, res) => {
  db.all("SELECT id, name, email FROM users", [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({
          status: "error",
          message: "Erro ao listar usuários: " + err.message,
        });
    }
    res.status(200).json({ status: "success", users: rows });
  });
};

exports.authenticateUser = (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({
          status: "error",
          message: "Erro ao autenticar usuário: " + err.message,
        });
    }

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuário não encontrado" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: "error", message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ status: "success", message: "Autenticação bem-sucedida", token });
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashedPassword, id],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({
              status: "error",
              message: "Erro ao atualizar usuário: " + err.message,
            });
        }
        if (this.changes === 0) {
          return res
            .status(404)
            .json({ status: "error", message: "Usuário não encontrado" });
        }
        res
          .status(200)
          .json({
            status: "success",
            message: "Usuário atualizado com sucesso!",
          });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Erro ao atualizar usuário: " + error.message,
      });
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      return res
        .status(500)
        .json({
          status: "error",
          message: "Erro ao apagar usuário: " + err.message,
        });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuário não encontrado" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Usuário apagado com sucesso!" });
  });
};
