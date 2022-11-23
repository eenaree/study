import app from './app.js';
import {
  closeModal,
  toggleActiveClassView,
  updateNoteListView,
  updateNotePreviewView,
} from './view.js';

const $addBtn = document.getElementById('add_btn');
const $noteList = document.getElementById('note_list');
const $notePreview = document.getElementById('note_preview');
const $modal = document.getElementById('modal');
const $allClearBtn = document.getElementById('all_clear_btn');

updateNoteListView(app.getNotes());
updateNotePreviewView(app.getActiveNote());
toggleActiveClassView(app.getActiveNote()?.id);

$addBtn?.addEventListener('click', () => {
  app.addNote({
    id: app.getNextNoteId(),
    title: '',
    body: '',
    date: new Date().toLocaleString(),
  });

  updateNoteListView(app.getNotes());
  updateNotePreviewView(app.getActiveNote());
  toggleActiveClassView(app.getActiveNote()?.id);
});

$noteList?.addEventListener('click', e => {
  if (!(e.target instanceof HTMLElement)) return;

  const $selectNote = e.target.closest('div');
  if (!($selectNote instanceof HTMLElement)) return;

  const selectId = Number($selectNote.dataset.id);
  app.selectNote(selectId);

  updateNotePreviewView(app.getActiveNote());
  toggleActiveClassView(app.getActiveNote()?.id);
});

$notePreview?.addEventListener('change', ({ target }) => {
  if (target instanceof HTMLInputElement) {
    app.updateNote({ title: target.value });
  }

  if (target instanceof HTMLTextAreaElement) {
    app.updateNote({ body: target.value });
  }

  updateNoteListView(app.getNotes());
  toggleActiveClassView(app.getActiveNote()?.id);
});

$modal?.addEventListener('click', ({ target }) => {
  if (!(target instanceof HTMLButtonElement)) return;

  if (target.classList.contains('delete')) {
    app.removeNote();

    updateNoteListView(app.getNotes());
    updateNotePreviewView(app.getActiveNote());
    toggleActiveClassView(app.getActiveNote()?.id);
  }

  closeModal();
});

$allClearBtn?.addEventListener('click', () => {
  app.resetNote();

  updateNoteListView(app.getNotes());
  updateNotePreviewView(app.getActiveNote());
});
