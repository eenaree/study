const $addBtn = document.querySelector<HTMLButtonElement>('#add_btn');
const $noteList = document.querySelector<HTMLDivElement>('#note_list');
const $rightPanel = document.querySelector<HTMLDivElement>('#right');
const $noteTitle = $rightPanel?.querySelector<HTMLInputElement>('#note_title');
const $noteBody = $rightPanel?.querySelector<HTMLTextAreaElement>('#note_body');
const $modal = document.getElementById('modal');
const $deleteBtn = $modal?.querySelector<HTMLButtonElement>('.delete');
const $deleteCancelBtn = $modal?.querySelector<HTMLButtonElement>('.cancel');

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

if (!($modal instanceof HTMLDivElement)) {
  throw new Error('modal must be HTML Div Element');
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
  const $button = document.createElement('button');
  $button.textContent = '삭제';
  $button.addEventListener('click', openModal);
  $div.append($button);
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
    const $button = document.createElement('button');
    $button.textContent = '삭제';
    $button.addEventListener('click', openModal);
    $div.append($button);
    $noteList.append($div);
  });
};

const renderCurrentNote = () => {
  if (currentNote) {
    $noteTitle.value = currentNote.title;
    $noteBody.value = currentNote.body;
    $rightPanel.hidden = false;
  } else {
    $noteTitle.value = '';
    $noteBody.value = '';
    $rightPanel.hidden = true;
  }
};

const openNote = (e: Event) => {
  if (e.target instanceof HTMLElement) {
    const $realTarget = e.target.closest('div');
    if (!($realTarget instanceof HTMLElement)) return;
    const matchedNote = notes.find(
      value => value.id === Number($realTarget.dataset.id)
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

const editNote = (e: Event) => {
  if (!currentNote) return;
  if (e.target instanceof HTMLInputElement) {
    currentNote.title = e.target.value;
  }
  if (e.target instanceof HTMLTextAreaElement) {
    currentNote.body = e.target.value;
  }
};

const updateNote = () => {
  if (!currentNote) return;

  notes.forEach(note => {
    if (note.id === currentNote?.id) {
      note.title = currentNote.title || '제목';
      note.body = currentNote.body || '내용';
      note.date = getTimestamp();
    }
  });
  localStorage.setItem('notes', JSON.stringify(notes));

  for (const $note of $noteList.children) {
    const title = $note.querySelector('.title');
    const cont = $note.querySelector('.cont');
    const date = $note.querySelector('.date');

    if (!(title && cont && date)) return;

    if ($note instanceof HTMLElement) {
      if (Number($note.dataset.id) !== currentNote.id) continue;
      title.textContent = currentNote?.title;
      cont.textContent = currentNote?.body;
      date.textContent = currentNote?.date;
    }
  }
};

const openModal = () => {
  $modal.hidden = false;
};

const closeModal = () => {
  $modal.hidden = true;
};

const deleteNote = (e: Event) => {
  if (e.target instanceof HTMLElement) {
    const matchedNoteIndex = notes.findIndex(
      note => note.id === currentNote?.id
    );
    if (matchedNoteIndex === -1) return;

    for (const $note of $noteList.children) {
      if ($note instanceof HTMLElement) {
        if (Number($note.dataset.id) !== currentNote?.id) continue;
        $note.remove();
        $noteList.lastElementChild?.classList.add('active');
        break;
      }
    }
    notes.splice(matchedNoteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    currentNote = notes.length > 0 ? notes[notes.length - 1] : null;
    renderCurrentNote();
    closeModal();
  }
};

renderNoteList();
renderCurrentNote();
$addBtn.addEventListener('click', addNote);

$noteList.addEventListener('click', openNote);

$noteTitle.addEventListener('input', editNote);
$noteBody.addEventListener('input', editNote);

$noteTitle.addEventListener('change', updateNote);
$noteBody.addEventListener('change', updateNote);

$deleteBtn?.addEventListener('click', deleteNote);
$deleteCancelBtn?.addEventListener('click', closeModal);
