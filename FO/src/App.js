import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [race, setRace] = useState('');
  const [attributes, setAttributes] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0
  });

  const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
  const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Dragonborn', 'Half-Elf', 'Half-Orc', 'Tiefling'];

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleClassChange = (event) => {
    setCharacterClass(event.target.value);
  };

  const handleRaceChange = (event) => {
    setRace(event.target.value);
  };

  const rollDice = () => {
    return Array.from({ length: 4 })
      .map(() => 1 + Math.floor(Math.random() * 6))
      .sort()
      .slice(1)
      .reduce((acc, curr) => acc + curr, 0);
  };

  const rollAttributes = () => {
    setAttributes({
      Strength: rollDice(),
      Dexterity: rollDice(),
      Constitution: rollDice(),
      Intelligence: rollDice(),
      Wisdom: rollDice(),
      Charisma: rollDice()
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && characterClass && race) {
      rollAttributes();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleSaveCharacter = async () => {
    if (name && characterClass && race) {
      try {
        const character = { name, characterClass, race, ...attributes };
        await fetch('http://localhost:3000/saveCharacter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(character),
        });
        alert('Character saved successfully!');
      } catch (error) {
        console.error('Error saving character:', error);
      }
    } else {
      alert('Please create a character first.');
    }
  };

  return (
    <div className="App">
      <h1>D&D Character Creator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Class:</label>
          <select value={characterClass} onChange={handleClassChange}>
            <option value="">Select a Class</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Race:</label>
          <select value={race} onChange={handleRaceChange}>
            <option value="">Select a Race</option>
            {races.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button type="submit">Create Character</button>
        
      </form>

      {attributes.Strength > 0 && (
        <div>
          <button onClick={handleSaveCharacter}>Save Character</button>
          <h2>Character Sheet</h2>
          <p>Name: {name}</p>
          <p>Class: {characterClass}</p>
          <p>Race: {race}</p>
          <p>Strength: {attributes.Strength}</p>
          <p>Dexterity: {attributes.Dexterity}</p>
          <p>Constitution: {attributes.Constitution}</p>
          <p>Intelligence: {attributes.Intelligence}</p>
          <p>Wisdom: {attributes.Wisdom}</p>
          <p>Charisma: {attributes.Charisma}</p>
        </div>
      )}
    </div>
  );
}

export default App;
