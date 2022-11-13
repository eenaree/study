const addBtn = document.querySelector<HTMLButtonElement>('#add_btn');
const noteList = document.querySelector<HTMLDivElement>('#note_list');
const noteTitle = document.querySelector<HTMLInputElement>('#note_title');
const noteBody = document.querySelector<HTMLTextAreaElement>('#note_body');
const rightPanel = document.querySelector<HTMLDivElement>('#right');

if (!(noteTitle instanceof HTMLInputElement)) {
  throw new Error('noteTitle must be HTML Input Element');
}

if (!(noteBody instanceof HTMLTextAreaElement)) {
  throw new Error('noteBody must be HTML TextArea Element');
}

if (!(rightPanel instanceof HTMLDivElement)) {
  throw new Error('rightPanel must be HTML Div Element');
}

interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
}

let notes: Note[] = [];
let currentNote: Note | null = null;

const initStorage = () => {
  const storageNotes = localStorage.getItem('notes');
  if (!storageNotes) {
    localStorage.setItem('notes', JSON.stringify([]));
  }
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

const createNoteTemplate = () => ({
  id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
  title: '제목',
  body: '내용',
  date: getTimestamp(),
});

const getTimestamp = () => new Date().toLocaleString();

const addNote = () => {
  // 오른쪽 노트 컨텐츠에 새로운 노트를 생성한다
  const noteTemplate = createNoteTemplate();
  notes.push(noteTemplate);
  noteTitle.value = noteTemplate.title;
  noteBody.value = noteTemplate.body;
  rightPanel.style.display = 'block';

  // 왼쪽 노트 리스트에 새 노트를 추가한다
  const newNote = document.createElement('div');
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    switch (i) {
      case 0:
        span.textContent = noteTemplate.title;
        span.classList.add('title');
        break;
      case 1:
        span.textContent = noteTemplate.body;
        span.classList.add('cont');
        break;
      case 2:
        span.textContent = noteTemplate.date;
        span.classList.add('date');
        break;
    }
    newNote.appendChild(span);
  }
  noteList?.appendChild(newNote);

  // 로컬스토리지에 새 노트를 추가한다
  localStorage.setItem('notes', JSON.stringify(notes));
};

const getStorageNotes = () => {
  const storageNotes = localStorage.getItem('notes');

  if (!storageNotes) return [];

  const parsedNotes = JSON.parse(storageNotes);
  if (isNotes(parsedNotes)) {
    return parsedNotes;
  }

  return [];
};

const renderNotes = () => {
  notes.forEach(note => {
    const newDiv = document.createElement('div');
    if (note.id === currentNote?.id) {
      newDiv.classList.add('active');
    }
    newDiv.dataset.id = `${note.id}`;
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      switch (i) {
        case 0:
          span.textContent = note.title;
          span.classList.add('title');
          break;
        case 1:
          span.textContent = note.body;
          span.classList.add('cont');
          break;
        case 2:
          span.textContent = note.date;
          span.classList.add('date');
          break;
      }
      newDiv.appendChild(span);
    }
    noteList?.appendChild(newDiv);
  });

  if (currentNote) {
    noteTitle.value = currentNote.title;
    noteBody.value = currentNote.body;
    rightPanel.style.display = 'block';
  }
};

initStorage();
notes = getStorageNotes();
currentNote = notes.length > 0 ? notes[notes.length - 1] : null;
renderNotes();
addBtn?.addEventListener('click', addNote);
