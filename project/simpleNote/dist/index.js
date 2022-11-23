var _a;
import app from './app.js';
import { closeModal, toggleActiveClassView, updateNoteListView, updateNotePreviewView, } from './view.js';
const $addBtn = document.getElementById('add_btn');
const $noteList = document.getElementById('note_list');
const $notePreview = document.getElementById('note_preview');
const $modal = document.getElementById('modal');
const $allClearBtn = document.getElementById('all_clear_btn');
updateNoteListView(app.getNotes());
updateNotePreviewView(app.getActiveNote());
toggleActiveClassView((_a = app.getActiveNote()) === null || _a === void 0 ? void 0 : _a.id);
$addBtn === null || $addBtn === void 0 ? void 0 : $addBtn.addEventListener('click', () => {
    var _a;
    app.addNote({
        id: app.getNextNoteId(),
        title: '',
        body: '',
        date: new Date().toLocaleString(),
    });
    updateNoteListView(app.getNotes());
    updateNotePreviewView(app.getActiveNote());
    toggleActiveClassView((_a = app.getActiveNote()) === null || _a === void 0 ? void 0 : _a.id);
});
$noteList === null || $noteList === void 0 ? void 0 : $noteList.addEventListener('click', e => {
    var _a;
    if (!(e.target instanceof HTMLElement))
        return;
    const $selectNote = e.target.closest('div');
    if (!($selectNote instanceof HTMLElement))
        return;
    const selectId = Number($selectNote.dataset.id);
    app.selectNote(selectId);
    updateNotePreviewView(app.getActiveNote());
    toggleActiveClassView((_a = app.getActiveNote()) === null || _a === void 0 ? void 0 : _a.id);
});
$notePreview === null || $notePreview === void 0 ? void 0 : $notePreview.addEventListener('change', ({ target }) => {
    var _a;
    if (target instanceof HTMLInputElement) {
        app.updateNote({ title: target.value });
    }
    if (target instanceof HTMLTextAreaElement) {
        app.updateNote({ body: target.value });
    }
    updateNoteListView(app.getNotes());
    toggleActiveClassView((_a = app.getActiveNote()) === null || _a === void 0 ? void 0 : _a.id);
});
$modal === null || $modal === void 0 ? void 0 : $modal.addEventListener('click', ({ target }) => {
    var _a;
    if (!(target instanceof HTMLButtonElement))
        return;
    if (target.classList.contains('delete')) {
        app.removeNote();
        updateNoteListView(app.getNotes());
        updateNotePreviewView(app.getActiveNote());
        toggleActiveClassView((_a = app.getActiveNote()) === null || _a === void 0 ? void 0 : _a.id);
    }
    closeModal();
});
$allClearBtn === null || $allClearBtn === void 0 ? void 0 : $allClearBtn.addEventListener('click', () => {
    app.resetNote();
    updateNoteListView(app.getNotes());
    updateNotePreviewView(app.getActiveNote());
});
