const fs = require('fs');
const readline = require('readline-sync');

// Read notes from JSON file
function readNotesFile() {
    return JSON.parse(fs.readFileSync('notes.json', 'utf8'));
}

// Write notes to JSON file
function notesToJSON(notes) {
    fs.writeFileSync('notes.json', JSON.stringify(notes))
}

// Notes
let notes = readNotesFile()

// Displays the Menu 
function displayMenu() {
    console.log(`
  1. Add a note 
  2. List all notes 
  3. Read a note
  4. Delete a note 
  5. Update a note 
  6. Exit
  `);
}

// Adds a note to Notes
function addNote() {
    console.log();
    const noteTitle = readline.question('Enter note title: ');
    const noteBody = readline.question('Enter note body: ');

    if (noteTitle && noteBody) {
        const timeAdded = new Date().toLocaleString();
        const foundNote = notes.some(note => note.title.toLowerCase() === noteTitle.toLowerCase());

        if (!foundNote) {
            notes.push({ title: noteTitle, body: noteBody, time_added: timeAdded });

            notesToJSON(notes);

            console.log('Note added successfully');
        } else {
            console.log(`Error: '${noteTitle}' already exists. To update, select option 5.`);
        }
    } else {
        console.log('Error: Title or Body can\'t be empty!');
    }
}
// List all notes
function listAllNotes() {
    console.log();
    notes.forEach((note, index) => {
        console.log(`
    ${index + 1}. Title: ${note.title}
       Body:  ${note.body}
       Added on: ${note.time_added}
    `);
    });
}

// Find a note by a given title
function findNoteByTitle(noteTitle) {
    return notes.find(note => note.title.toLowerCase() === noteTitle.toLowerCase());
}

// Finds a note by a given title and displays found note to user
function readNote() {
    console.log();
    const noteTitle = readline.question('Enter note title: ');
    const foundNote = findNoteByTitle(noteTitle);

    if (foundNote) {
        console.log(`
      Title: ${foundNote.title}
      Body:  ${foundNote.body}
      Added on: ${foundNote.time_added}
    `);
    } else {
        console.log(`${noteTitle} not found!`);
    }
}

// Deletes note given a note tile
function deleteNote() {
    console.log();
    const noteTitle = readline.question('Enter note title to delete: ');
    const foundNote = findNoteByTitle(noteTitle);

    if (foundNote) {
        const indexOfNote = notes.indexOf(foundNote);
        notes.splice(indexOfNote, 1);

        notesToJSON(notes);

        console.log('Note has been deleted successfully!');
    } else {
        console.log(`${noteTitle} not found!`);
    }
}

// Updates a note given a note title
function updateNote() {
    console.log();
    const noteTitle = readline.question('Enter note title: ');
    const foundNote = findNoteByTitle(noteTitle);

    if (foundNote) {
        console.log(`\nBody to be updated:  ${foundNote.body}\n`);
        const newNoteBody = readline.question('Enter new note body: ');
        let indexOfNote = notes.indexOf(foundNote);
        notes[indexOfNote]['body'] = newNoteBody;

        notesToJSON(notes);

        console.log('Note updated successfully!');
    } else {
        console.log(`${noteTitle} not found!`);
    }
}

// Exits App
function exitApp() {
    console.log('\nExiting App');
    process.exit();
}

// Dispatcher
const userOptions = {
    '1': addNote,
    '2': listAllNotes,
    '3': readNote,
    '4': deleteNote,
    '5': updateNote,
    '6': exitApp
};

// Main app
function runApp() {
    while (true) {
        displayMenu();
        const userChoice = readline.question('Enter your choice: ');

        if (userOptions[userChoice]) {
            userOptions[userChoice]();
        } else {
            console.log('Invalid choice. Please choose a valid option.');
        }
    }
}

// runs the app
runApp();
