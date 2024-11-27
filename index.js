const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware pour analyser le JSON
app.use(bodyParser.json());

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Remplace par ton utilisateur MySQL
  password: "", // Remplace par ton mot de passe MySQL
  database: "my_database", // Nom de ta base de données
});

// Connexion à MySQL
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    process.exit(1);
  }
  console.log("Connecté à la base de données MySQL.");
});

// Route POST pour ajouter un enregistrement
app.post("/add", (req, res) => {
  const { name, email } = req.body;
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, name, email });
  });
});

// Route GET pour récupérer tous les enregistrements
app.get("/records", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
});

// Route GET pour récupérer un enregistrement spécifique
app.get("/record/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send(results[0]);
  });
});

// Route PUT pour mettre à jour un enregistrement
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ id, name, email });
  });
});

// Route DELETE pour supprimer un enregistrement
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ message: "Record deleted successfully" });
  });
});

console.log('Server is about to start...');
// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

