import { Note } from './app.js';

const $noteList = document.getElementById('note_list');
const $notePreview = document.getElementById('note_preview');
const $modal = document.getElementById('modal');
const $modalDialog = document.getElementById('modal_dialog');

export const openDeleteModal = () => {
  if (!($modal instanceof HTMLElement && $modalDialog instanceof HTMLElement)) {
    throw new Error('modal must be an HTML element');
  }

  $modalDialog.innerHTML = `
    <div class="delete_modal">
      <p>노트를 삭제하시겠습니까?</p>
      <div>
        <button class="delete">예</button>
        <button class="cancel">아니오</button>
      </div>
    </div>
  `;
  $modal.hidden = false;
};

export const closeModal = () => {
  if (!($modal instanceof HTMLElement && $modalDialog instanceof HTMLElement)) {
    throw new Error('modal must be an HTML element');
  }

  $modalDialog.innerHTML = '';
  $modal.hidden = true;
};

export const updateNoteListView = (notes: Note[], activeId?: number) => {
  const list: HTMLDivElement[] = [];

  notes.forEach(note => {
    const $div = document.createElement('div');
    $div.classList.toggle('active', note.id === activeId);
    $div.dataset.id = `${note.id}`;
    for (let i = 0; i < 3; i++) {
      const $span = document.createElement('span');
      switch (i) {
        case 0:
          $span.textContent = note.title || '제목을 입력하세요';
          $span.classList.add('title');
          break;
        case 1:
          $span.textContent = note.body || '내용을 입력하세요';
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
    $button.addEventListener('click', openDeleteModal);
    $div.append($button);
    list.push($div);
  });

  list.sort((a, b) => Number(b.dataset.id) - Number(a.dataset.id));
  $noteList?.replaceChildren(...list);
};

export const updateNotePreviewView = (
  note: { title: string; body: string } | undefined
) => {
  if (!($notePreview instanceof HTMLElement)) {
    throw new Error('notePreview must be an HTML element');
  }

  if (!note) {
    $notePreview.replaceChildren();
    return;
  }

  const input = document.createElement('input');
  const textarea = document.createElement('textarea');
  input.id = 'note_title';
  input.placeholder = '제목을 입력하세요';
  input.value = note.title;
  textarea.id = 'note_body';
  textarea.placeholder = '내용을 입력하세요';
  textarea.value = note.body;

  $notePreview.replaceChildren(input, textarea);
};
