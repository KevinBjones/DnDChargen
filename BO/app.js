const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dnd'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(cors());

app.post('/saveCharacter', (req, res) => {
  const { name, classID, raceID, attributes } = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error('An error occurred in transaction initiation:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const charQuery = 'INSERT INTO Characters (Name, ClassID, RaceID) VALUES (?, ?, ?)';
    connection.query(charQuery, [name, classID, raceID], (err, charResult) => {
      if (err) {
        console.error('An error occurred in character creation:', err);
        return connection.rollback(() => {
          return res.status(500).json({ message: 'Internal server error' });
        });
      }

      const characterID = charResult.insertId;
      const attrQuery = 'INSERT INTO Attributes (CharacterID, Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) VALUES (?, ?, ?, ?, ?, ?, ?)';
      connection.query(attrQuery, [characterID, attributes.Strength, attributes.Dexterity, attributes.Constitution, attributes.Intelligence, attributes.Wisdom, attributes.Charisma], (attrErr) => {
        if (attrErr) {
          console.error('An error occurred in attributes insertion:', attrErr);
          return connection.rollback(() => {
            return res.status(500).json({ message: 'Internal server error' });
          });
        }

        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('An error occurred in transaction commit:', commitErr);
            return connection.rollback(() => {
              return res.status(500).json({ message: 'Internal server error' });
            });
          }

          res.status(201).json({ message: 'Character saved', characterId: characterID });
        });
      });
    });
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
