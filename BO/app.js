const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'express',
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

    const charQuery = 'INSERT INTO characters (Name, ClassID, RaceID) VALUES (?, ?, ?)';
    connection.query(charQuery, [name, classID, raceID], (err, charResult) => {
      if (err) {
        console.error('An error occurred in character creation:', err);
        return connection.rollback(() => {
          return res.status(500).json({ message: 'Internal server error' });
        });
      }

      const characterID = charResult.insertId;
      const attrQuery = 'INSERT INTO attributes (CharacterID, Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) VALUES (?, ?, ?, ?, ?, ?, ?)';
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

app.get('/loadCharacters', (req, res) => {
  const query = 'SELECT * FROM characters JOIN attributes ON characters.CharacterID = attributes.CharacterID';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching characters:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const characters = results.map(row => ({
      id: row.CharacterID,
      name: row.Name,
      classID: row.ClassID,
      raceID: row.RaceID,
      attributes: {
        Strength: row.Strength,
        Dexterity: row.Dexterity,
        Constitution: row.Constitution,
        Intelligence: row.Intelligence,
        Wisdom: row.Wisdom,
        Charisma: row.Charisma
      }
    }));

    res.status(200).json({ characters });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
