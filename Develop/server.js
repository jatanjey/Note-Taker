import express from 'express';
import { urlencoded, json } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Convert the module URL to a file path
const __dirname = dirname(__filename); // Determine the directory name

const app = express();
const PORT = process.env.PORT || 0; // Use 0 to indicate a random available port

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static(join(__dirname, 'public')));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'notes.html')); // Use path.join to ensure correct file path
});

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(readFileSync(join(__dirname, 'db', 'db.json'), 'utf8')); // Use path.join to ensure correct file path
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString(); // Assign a unique ID
  const notes = JSON.parse(readFileSync(join(__dirname, 'db', 'db.json'), 'utf8')); // Use path.join to ensure correct file path
  notes.push(newNote);
  writeFileSync(join(__dirname, 'db', 'db.json'), JSON.stringify(notes)); // Use path.join to ensure correct file path
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(readFileSync(join(__dirname, 'db', 'db.json'), 'utf8')); // Use path.join to ensure correct file path
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  writeFileSync(join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes)); // Use path.join to ensure correct file path
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html')); // Use path.join to ensure correct file path
});

// Start the server
const server = app.listen(PORT, () => {
  const actualPort = server.address().port; // Get the actual port the server is listening on
  console.log(`Server is listening on port ${actualPort}`);
});



