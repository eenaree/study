import app from './app.js';
import {
  closeModal,
  updateNoteListView,
  updateNotePreviewView,
} from './view.js';

const $addBtn = document.getElementById('add_btn');
const $noteList = document.getElementById('note_list');
const $notePreview = document.getElementById('note_preview');
const $modal = document.getElementById('modal');
const $allClearBtn = document.getElementById('all_clear_btn');

updateNoteListView(app.getNotes(), app.getActiveNoteId());
updateNotePreviewView(app.getActiveNote());

$addBtn?.addEventListener('click', () => {
  app.addNote({
    id: app.getNextNoteId(),
    title: '',
    body: '',
    date: new Date().toLocaleString(),
  });

  updateNoteListView(app.getNotes(), app.getActiveNoteId());
  updateNotePreviewView(app.getActiveNote());
});

$noteList?.addEventListener('click', e => {
  if (!(e.target instanceof HTMLElement)) return;

  const $selectNote = e.target.closest('div');
  if (!($selectNote instanceof HTMLElement)) return;

  const selectId = Number($selectNote.dataset.id);
  app.selectNote(selectId);

  updateNoteListView(app.getNotes(), app.getActiveNoteId());
  updateNotePreviewView(app.getActiveNote());
});

$notePreview?.addEventListener('change', ({ target }) => {
  if (target instanceof HTMLInputElement) {
    app.updateNote({ title: target.value });
  }

  if (target instanceof HTMLTextAreaElement) {
    app.updateNote({ body: target.value });
  }

  updateNoteListView(app.getNotes(), app.getActiveNoteId());
});

$modal?.addEventListener('click', ({ target }) => {
  if (!(target instanceof HTMLButtonElement)) return;

  if (target.classList.contains('delete')) {
    app.removeNote();

    updateNoteListView(app.getNotes(), app.getActiveNoteId());
    updateNotePreviewView(app.getActiveNote());
  }

  closeModal();
});

$allClearBtn?.addEventListener('click', () => {
  app.resetNote();

  updateNoteListView(app.getNotes(), app.getActiveNoteId());
  updateNotePreviewView(app.getActiveNote());
});
