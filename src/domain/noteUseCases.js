export class NoteUseCases {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  getAllNotes() {
    return this.noteRepository.getAll();
  }

  getNoteById(id) {
    return this.noteRepository.getById(id);
  }

  createNote(note) {
    return this.noteRepository.create(note);
  }

  updateNote(note) {
    return this.noteRepository.update(note);
  }

  deleteNote(id) {
    return this.noteRepository.delete(id);
  }
}
