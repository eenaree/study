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

const initStorage = () => {
  const storageNotes = localStorage.getItem('notes');
  if (!storageNotes) {
    localStorage.setItem('notes', JSON.stringify([]));
  }
};

const isNotes = (
  values: unknown
): values is { title: string; body: string }[] => {
  if (Array.isArray(values)) {
    return values.every(value => 'title' in value && 'body' in value);
  }

  return false;
};

const addNote = () => {
  // 오른쪽 노트 컨텐츠에 새로운 노트를 생성한다
  noteTitle.value = '제목';
  noteBody.value = '내용';
  rightPanel.style.display = 'block';

  // 왼쪽 노트 리스트에 새 노트를 추가한다
  const newNote = document.createElement('div');
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    switch (i) {
      case 0:
        span.textContent = noteTitle.value;
        break;
      case 1:
        span.textContent = noteBody.value;
        span.classList.add('cont');
        break;
      case 2:
        span.textContent = '날짜';
        span.classList.add('date');
        break;
    }
    newNote.appendChild(span);
  }
  noteList?.appendChild(newNote);

  // 로컬스토리지에 새 노트를 추가한다
  // 기존에 저장된 노트가 있다면, 그 노트에 뒤에 추가적으로 붙이기
  const storageNotes = localStorage.getItem('notes');
  if (storageNotes) {
    const parsedNotes = JSON.parse(storageNotes);
    if (isNotes(parsedNotes)) {
      localStorage.setItem(
        'notes',
        JSON.stringify([
          ...parsedNotes,
          { title: noteTitle.value, body: noteBody.value },
        ])
      );
    }
  }
};

initStorage();
addBtn?.addEventListener('click', addNote);
