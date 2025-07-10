import { NoteUseCases } from '../domain/noteUseCases';
import { NoteLocalStorageRepository } from '../infrastructure/NoteLocalStorageRepository';

const repo = new NoteLocalStorageRepository();
export const noteService = new NoteUseCases(repo);
