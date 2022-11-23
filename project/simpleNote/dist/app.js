const isNotes = (value) => {
    if (Array.isArray(value)) {
        return value.every(value => 'id' in value && 'title' in value && 'body' in value && 'date' in value);
    }
    return false;
};
const getStorageNotes = () => {
    const notes = localStorage.getItem('notes');
    if (!notes)
        return [];
    const parsedNotes = JSON.parse(notes);
    if (isNotes(parsedNotes))
        return parsedNotes;
    return [];
};
let notes = getStorageNotes();
let activeNote = notes.length > 0 ? notes[notes.length - 1] : undefined;
const app = {
    getNotes: () => [...notes],
    getActiveNote: () => {
        return activeNote ? Object.assign({}, activeNote) : undefined;
    },
    getNextNoteId: () => {
        return notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
    },
    addNote: (note) => {
        notes.push(note);
        activeNote = note;
        app._save(notes);
    },
    removeNote: () => {
        notes = notes.filter(note => note.id !== (activeNote === null || activeNote === void 0 ? void 0 : activeNote.id));
        activeNote = notes[notes.length - 1];
        app._save(notes);
    },
    resetNote: () => {
        notes = [];
        activeNote = undefined;
        app._save(notes);
    },
    updateNote: ({ title, body }) => {
        notes = notes.map(note => note.id === (activeNote === null || activeNote === void 0 ? void 0 : activeNote.id)
            ? Object.assign(Object.assign({}, note), { title: title !== null && title !== void 0 ? title : note.title, body: body !== null && body !== void 0 ? body : note.body, date: new Date().toLocaleString() }) : note);
        activeNote = notes.find(note => note.id === (activeNote === null || activeNote === void 0 ? void 0 : activeNote.id));
        app._save(notes);
    },
    selectNote: (noteId) => {
        const note = notes.find(note => note.id === noteId);
        if (note) {
            activeNote = note;
        }
    },
    _save(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    },
};
export default app;
