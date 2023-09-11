const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Before setting up your routes, you'll want to add this line, 
// which sets up Express to parse the JSON bodies of incoming requests.
// You'll need this for the POST and PUT routes.
app.use(express.json());

// loadsNote Data
function loadNotesData() {
    const data = fs.readFileSync('notes.json');
    return JSON.parse(data)
}

// Writes notes to JSON file
function writeNoteToFile(notes) {
    fs.writeFileSync('notes.json', JSON.stringify(notes))
}

// Adds new notes
function addNote(newNote) {
    let notes = loadNotesData();
    const foundNote = notes.some(note => note.title.toLowerCase() === newNote.title.toLowerCase());

    if (!foundNote) {
        newNote['time_added'] = new Date().toLocaleString();
        notes.push(newNote);

        writeNoteToFile(notes);

        return newNote;
    }
}

// Deletes Notes given a note title
function deleteNote(noteTitle) {
    let notes = loadNotesData();
    let noteIndex = notes.findIndex(note => note.title.toLowerCase() === noteTitle.toLowerCase());
    if (noteIndex !== -1) {
        let deletedNote = notes.splice(noteIndex, 1)[0]
        writeNoteToFile(notes);

        return deletedNote;
    }
    return null
}

// Updates notes
function updateNote(noteTitle, newNoteBody) {
    let notes = loadNotesData();
    let noteIndex = notes.findIndex(note => note.title.toLowerCase() === noteTitle.toLowerCase());
    if (noteIndex !== -1) {
        notes[noteIndex]['body'] = newNoteBody;
        writeNoteToFile(notes);

        return notes[noteIndex];
    }
}

// GET /notes route to list all notes
app.get('/notes', (req, res) => {
    let notes = loadNotesData();
    res.json(notes);
});


// POST /notes route to add a new note
app.post('/notes', (req, res) => {
    const newNote = req.body;
    if (!newNote.title || !newNote.body) return res.status(400).json({ error: 'Both title and body are required' });

    if (addNote(req.body)) {
        res.status(201).json({ success: 'Note added successfully' });
    } else {
        res.status(400).json({ error: `${newNote.title} already exists!` });
    }
});

// GET /notes/:title route to search notes by note-title and display found note 
app.get('/notes/:title', (req, res) => {
    const noteTitle = req.params.title;
    let notes = loadNotesData();
    let foundNote = notes.find(note => note.title.toLowerCase() === noteTitle.toLowerCase());
    if (!foundNote) return res.status(400).json({ error: `${noteTitle} not found!` });
    res.json(foundNote);
});

// DELETE /notes/:title route to delete a note with a given title
app.delete('/notes/:title', (req, res) => {
    noteTitle = req.params.title;
    if (!deleteNote(noteTitle)) return res.status(400).json({ error: `${noteTitle} not found!` });
    res.json({success: `Note deleted successfully!`})
});

// PUT notes/:title route updates note given a title and new note body
app.put('/notes/:title', (req, res) => {
    noteTitle = req.params.title;
    newNoteBody = req.body;

    // checks that new note body contains only one property
    if (Object.keys(newNoteBody).length > 1) {
        return res.status(400).json({ error: `Only new body of note is required` })
    };

    if (!updateNote(noteTitle, newNoteBody.body)) return res.status(400).json({ error: `${noteTitle} not found!` });
    res.json({ success: `Note updated successfully!` })
});


// Starts the server
app.listen(port, () => {
    console.log(`Note Organizer API is listening on port ${port}!`)
});
