const $addBtn = document.querySelector<HTMLButtonElement>('#add_btn');
const $noteList = document.querySelector<HTMLDivElement>('#note_list');
const $rightPanel = document.querySelector<HTMLDivElement>('#right');
const $noteTitle = $rightPanel?.querySelector<HTMLInputElement>('#note_title');
const $noteBody = $rightPanel?.querySelector<HTMLTextAreaElement>('#note_body');

if (!($addBtn instanceof HTMLButtonElement)) {
  throw new Error('addBtn must be HTML Button Element');
}

if (!($noteList instanceof HTMLDivElement)) {
  throw new Error('noteList must be HTML Div Element');
}

if (!($rightPanel instanceof HTMLDivElement)) {
  throw new Error('rightPanel must be HTML Div Element');
}

if (!($noteTitle instanceof HTMLInputElement)) {
  throw new Error('noteTitle must be HTML Input Element');
}

if (!($noteBody instanceof HTMLTextAreaElement)) {
  throw new Error('noteBody must be HTML TextArea Element');
}

interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
}

const getStorageNotes = () => {
  const storageNotes = localStorage.getItem('notes');

  if (!storageNotes) {
    localStorage.setItem('notes', JSON.stringify([]));
    return [];
  }

  const parsedNotes = JSON.parse(storageNotes);
  if (isNotes(parsedNotes)) {
    return parsedNotes;
  }

  localStorage.setItem('notes', JSON.stringify([]));
  return [];
};

const isNotes = (values: unknown): values is Note[] => {
  if (Array.isArray(values)) {
    return values.every(
      value =>
        'id' in value && 'title' in value && 'body' in value && 'date' in value
    );
  }

  return false;
};

const notes = getStorageNotes();
let currentNote = notes.length > 0 ? notes[notes.length - 1] : null;

const createNote = (note: Note) => {
  const $div = document.createElement('div');
  for (const $note of $noteList.children) {
    $note.classList.remove('active');
  }
  $div.classList.add('active');
  for (let i = 0; i < 3; i++) {
    const $span = document.createElement('span');
    switch (i) {
      case 0:
        $span.textContent = note.title;
        $span.classList.add('title');
        break;
      case 1:
        $span.textContent = note.body;
        $span.classList.add('cont');
        break;
      case 2:
        $span.textContent = note.date;
        $span.classList.add('date');
        break;
    }
    $div.append($span);
  }
  $noteList.append($div);
};

const getTimestamp = () => new Date().toLocaleString();

const addNote = () => {
  const newNote = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    title: '제목',
    body: '내용',
    date: getTimestamp(),
  };

  currentNote = newNote;
  notes.push(newNote);
  localStorage.setItem('notes', JSON.stringify(notes));
  createNote(newNote);
  renderCurrentNote();
};

const renderNoteList = () => {
  notes.forEach(note => {
    const $div = document.createElement('div');
    $div.classList.toggle('active', note.id === currentNote?.id);
    $div.dataset.id = `${note.id}`;
    for (let i = 0; i < 3; i++) {
      const $span = document.createElement('span');
      switch (i) {
        case 0:
          $span.textContent = note.title;
          $span.classList.add('title');
          break;
        case 1:
          $span.textContent = note.body;
          $span.classList.add('cont');
          break;
        case 2:
          $span.textContent = note.date;
          $span.classList.add('date');
          break;
      }
      $div.append($span);
    }
    $noteList.append($div);
  });
};

const renderCurrentNote = () => {
  if (currentNote) {
    $noteTitle.value = currentNote.title;
    $noteBody.value = currentNote.body;
    $rightPanel.style.display = 'block';
  }
};

const openNote = (e: Event) => {
  if (e.currentTarget instanceof HTMLElement) {
    const currentTarget = e.currentTarget;
    const matchedNote = notes.find(
      value => value.id === Number(currentTarget.dataset.id)
    );
    if (!matchedNote) return;

    currentNote = matchedNote;
    for (const $note of $noteList.children) {
      if ($note instanceof HTMLElement) {
        $note.classList.toggle(
          'active',
          Number($note.dataset.id) === currentNote.id
        );
      }
    }
    renderCurrentNote();
  }
};

renderNoteList();
renderCurrentNote();
$addBtn.addEventListener('click', addNote);

for (const $note of $noteList.children) {
  $note.addEventListener('click', openNote);
}
