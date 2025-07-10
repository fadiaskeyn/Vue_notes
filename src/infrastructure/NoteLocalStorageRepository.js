import { Note } from '../domain/Note';

const STORAGE_KEY = 'notes';

export class NoteLocalStorageRepository {
  getAll() {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return notes.map(n => new Note(n));
  }

  getById(id) {
    const notes = this.getAll();
    return notes.find(n => n.id === id);
  }

  create(note) {
    const notes = this.getAll();
    notes.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return note;
  }

  update(note) {
    let notes = this.getAll();
    notes = notes.map(n => n.id === note.id ? note : n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return note;
  }

  delete(id) {
    let notes = this.getAll();
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  }
}
