"use strict";
const $addBtn = document.querySelector('#add_btn');
const $noteList = document.querySelector('#note_list');
const $rightPanel = document.querySelector('#right');
const $noteTitle = $rightPanel === null || $rightPanel === void 0 ? void 0 : $rightPanel.querySelector('#note_title');
const $noteBody = $rightPanel === null || $rightPanel === void 0 ? void 0 : $rightPanel.querySelector('#note_body');
const $modal = document.getElementById('modal');
const $deleteBtn = $modal === null || $modal === void 0 ? void 0 : $modal.querySelector('.delete');
const $deleteCancelBtn = $modal === null || $modal === void 0 ? void 0 : $modal.querySelector('.cancel');
const $allClearBtn = document.querySelector('#all_clear_btn');
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
if (!($allClearBtn instanceof HTMLButtonElement)) {
    throw new Error('allClearBtn must be HTML Button Element');
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
const isNotes = (values) => {
    if (Array.isArray(values)) {
        return values.every(value => 'id' in value && 'title' in value && 'body' in value && 'date' in value);
    }
    return false;
};
const notes = getStorageNotes();
let currentNote = notes.length > 0 ? notes[notes.length - 1] : null;
const createNote = (note) => {
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
    $button.addEventListener('click', openModal);
    $div.append($button);
    $noteList.prepend($div);
};
const getTimestamp = () => new Date().toLocaleString();
const addNote = () => {
    const newNote = {
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
        title: '',
        body: '',
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
        $div.classList.toggle('active', note.id === (currentNote === null || currentNote === void 0 ? void 0 : currentNote.id));
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
        $button.addEventListener('click', openModal);
        $div.append($button);
        $noteList.prepend($div);
    });
};
const renderCurrentNote = () => {
    if (currentNote) {
        $noteTitle.value = currentNote.title;
        $noteBody.value = currentNote.body;
        $rightPanel.hidden = false;
    }
    else {
        $noteTitle.value = '';
        $noteBody.value = '';
        $rightPanel.hidden = true;
    }
};
const openNote = (e) => {
    if (e.target instanceof HTMLElement) {
        const $realTarget = e.target.closest('div');
        if (!($realTarget instanceof HTMLElement))
            return;
        const matchedNote = notes.find(value => value.id === Number($realTarget.dataset.id));
        if (!matchedNote)
            return;
        currentNote = matchedNote;
        for (const $note of $noteList.children) {
            if ($note instanceof HTMLElement) {
                $note.classList.toggle('active', Number($note.dataset.id) === currentNote.id);
            }
        }
        renderCurrentNote();
    }
};
const editNote = (e) => {
    if (!currentNote)
        return;
    if (e.target instanceof HTMLInputElement) {
        currentNote.title = e.target.value;
    }
    if (e.target instanceof HTMLTextAreaElement) {
        currentNote.body = e.target.value;
    }
};
const updateNote = () => {
    if (!currentNote)
        return;
    notes.forEach(note => {
        if (note.id === (currentNote === null || currentNote === void 0 ? void 0 : currentNote.id)) {
            note.title = currentNote.title;
            note.body = currentNote.body;
            note.date = getTimestamp();
        }
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    for (const $note of $noteList.children) {
        const title = $note.querySelector('.title');
        const cont = $note.querySelector('.cont');
        const date = $note.querySelector('.date');
        if (!(title && cont && date))
            return;
        if ($note instanceof HTMLElement) {
            if (Number($note.dataset.id) !== currentNote.id)
                continue;
            title.textContent = (currentNote === null || currentNote === void 0 ? void 0 : currentNote.title) || '제목을 입력하세요';
            cont.textContent = (currentNote === null || currentNote === void 0 ? void 0 : currentNote.body) || '내용을 입력하세요';
            date.textContent = currentNote === null || currentNote === void 0 ? void 0 : currentNote.date;
        }
    }
};
const openModal = () => {
    $modal.hidden = false;
};
const closeModal = () => {
    $modal.hidden = true;
};
const deleteNote = (e) => {
    var _a;
    if (e.target instanceof HTMLElement) {
        const matchedNoteIndex = notes.findIndex(note => note.id === (currentNote === null || currentNote === void 0 ? void 0 : currentNote.id));
        if (matchedNoteIndex === -1)
            return;
        for (const $note of $noteList.children) {
            if ($note instanceof HTMLElement) {
                if (Number($note.dataset.id) !== (currentNote === null || currentNote === void 0 ? void 0 : currentNote.id))
                    continue;
                $note.remove();
                (_a = $noteList.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.add('active');
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
const init = () => {
    notes.splice(0);
    currentNote = null;
    localStorage.setItem('notes', JSON.stringify(notes));
    $noteList.innerHTML = '';
    renderCurrentNote();
};
renderNoteList();
renderCurrentNote();
$addBtn.addEventListener('click', addNote);
$noteList.addEventListener('click', openNote);
$noteTitle.addEventListener('input', editNote);
$noteBody.addEventListener('input', editNote);
$noteTitle.addEventListener('change', updateNote);
$noteBody.addEventListener('change', updateNote);
$deleteBtn === null || $deleteBtn === void 0 ? void 0 : $deleteBtn.addEventListener('click', deleteNote);
$deleteCancelBtn === null || $deleteCancelBtn === void 0 ? void 0 : $deleteCancelBtn.addEventListener('click', closeModal);
$allClearBtn.addEventListener('click', init);
