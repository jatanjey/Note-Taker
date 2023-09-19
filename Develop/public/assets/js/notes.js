document.addEventListener('DOMContentLoaded', () => {
  const noteList = document.getElementById('note-list');
  const noteTitleInput = document.getElementById('note-title');
  const noteTextInput = document.getElementById('note-text');
  const saveNoteButton = document.querySelector('.save-note');
  const newNoteButton = document.querySelector('.new-note');

  let notes = []; // An array to store notes

  // Function to render notes to the list
  function renderNotes() {
    noteList.innerHTML = '';
    notes.forEach((note, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');

      listItem.innerHTML = `
        <button class="btn btn-light btn-note" data-index="${index}">${note.title}</button>
        <button class="btn btn-danger btn-delete" data-index="${index}">Delete</button>
      `;

      noteList.appendChild(listItem);

      // Event listener to handle deleting a note
      const deleteButton = listItem.querySelector('.btn-delete');
      deleteButton.addEventListener('click', () => {
        deleteNote(index);
      });
    });
  }

  // Function to fetch notes from the server and populate the UI
  async function fetchAndRenderNotes() {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes from the server.');
      }
      notes = await response.json();

      // Render the notes in the UI
      renderNotes();
    } catch (error) {
      console.error(error);
    }
  }

  // Event listener to handle displaying a note when clicked
  noteList.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-note')) {
      const index = event.target.getAttribute('data-index');
      const selectedNote = notes[index];
      noteTitleInput.value = selectedNote.title;
      noteTextInput.value = selectedNote.text;
    }
  });

  // Event listener to handle creating a new note
  newNoteButton.addEventListener('click', () => {
    noteTitleInput.value = '';
    noteTextInput.value = '';
  });

  // Initialize by fetching and rendering notes
  fetchAndRenderNotes();

  // Event listener to handle saving a new note
  saveNoteButton.addEventListener('click', async () => {
    const title = noteTitleInput.value.trim();
    const text = noteTextInput.value.trim();

    if (title && text) {
      const newNote = { title, text };

      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        });

        if (!response.ok) {
          console.error('Failed to save the note on the server.');
        } else {
          console.log('Note saved successfully.');
          // Clear input fields
          noteTitleInput.value = '';
          noteTextInput.value = '';

          // Fetch and render notes again after saving
          fetchAndRenderNotes();
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  // Function to delete a note
  async function deleteNote(index) {
    if (index >= 0 && index < notes.length) {
      const noteToDelete = notes[index];

      try {
        const response = await fetch(`/api/notes/${noteToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Failed to delete the note on the server.');
        } else {
          console.log('Note deleted successfully.');
          // Remove the deleted note from the local array and re-render the notes
          notes.splice(index, 1);
          renderNotes();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});


