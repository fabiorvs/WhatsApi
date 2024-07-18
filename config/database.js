const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

// Define o caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, "..", "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

  // Adiciona o usuário padrão
  const defaultPassword = "Admin@#!";
  bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Erro ao criar senha padrão", err);
      return;
    }
    db.run(
      "INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)",
      ["Admin", "admin@admin.com", hashedPassword],
      (err) => {
        if (err) {
          console.error("Erro ao criar usuário padrão", err);
        } else {
          console.log("Usuário padrão criado com sucesso");
        }
      }
    );
  });
});

module.exports = db;
