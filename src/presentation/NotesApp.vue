<template>
  <div class="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-gradient-to-br from-cyan-50 via-pink-50 to-yellow-50 font-['Poppins']">
    <div class="w-full max-w-4xl">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-4xl font-bold text-green-500">My Notes</h1>
        <button @click="showForm = true" class="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all">
          <span class="text-xl">+</span> Add Note
        </button>
      </div>

      <div class="mb-8">
        <div class="relative">
          <input v-model="search" type="text" placeholder="Search" class="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white text-lg" />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      <div v-if="filteredNotes.length === 0" class="text-center text-gray-400">No notes found.</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="note in filteredNotes" :key="note.id" :class="['rounded-xl shadow-md p-5 min-h-[180px] transition-all flex flex-col justify-between', getCardBg(note.id)]">
          <div>
            <h2 class="font-bold text-xl text-gray-800 mb-2">{{ note.title }}</h2>
            <p class="text-gray-700 text-sm">{{ note.content }}</p>
          </div>
          <div class="flex justify-between items-center border-t pt-3 mt-4">
            <button @click="editNote(note)" class="flex items-center gap-1 text-sm text-gray-700 hover:text-pink-500 font-medium">
              ✏️ Edit
            </button>
            <button @click="deleteNote(note.id)" class="flex items-center gap-1 text-sm text-gray-700 hover:text-red-500 font-medium">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Note -->
    <div v-if="showForm" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button @click="closeForm" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-4">{{ form.id ? 'Edit Note' : 'Add Note' }}</h2>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <input v-model="form.title" type="text" placeholder="Title" class="input input-bordered w-full" required />
          <textarea v-model="form.content" placeholder="Content" class="input input-bordered w-full h-24 resize-none" required></textarea>
          <button type="submit" class="btn btn-primary w-full">{{ form.id ? 'Update' : 'Add Note' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { noteService } from '../application/noteService';
import { Note } from '../domain/Note';

const notes = ref([]);
const form = ref({ id: '', title: '', content: '' });
const showForm = ref(false);
const search = ref('');

const pastelBgs = [
  'bg-green-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-blue-100',
  'bg-pink-100',
  'bg-orange-100',
  'bg-teal-100',
];

function getCardBg(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return pastelBgs[hash % pastelBgs.length];
}

const filteredNotes = computed(() => {
  if (!search.value) return notes.value;
  return notes.value.filter(
    n => n.title.toLowerCase().includes(search.value.toLowerCase()) ||
         n.content.toLowerCase().includes(search.value.toLowerCase())
  );
});

function loadNotes() {
  notes.value = noteService.getAllNotes();
}

function resetForm() {
  form.value = { id: '', title: '', content: '' };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

function onSubmit() {
  if (form.value.id) {
    const updated = new Note({
      ...form.value,
      updatedAt: new Date().toISOString(),
      createdAt: notes.value.find(n => n.id === form.value.id)?.createdAt || new Date().toISOString(),
    });
    noteService.updateNote(updated);
  } else {
    const newNote = new Note({
      id: Date.now().toString(),
      title: form.value.title,
      content: form.value.content,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    });
    noteService.createNote(newNote);
  }
  closeForm();
  loadNotes();
}

function editNote(note) {
  form.value = { ...note };
  showForm.value = true;
}

function deleteNote(id) {
  if (confirm('Delete this note?')) {
    noteService.deleteNote(id);
    loadNotes();
    resetForm();
  }
}

onMounted(loadNotes);
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200 text-base;
}
.btn {
  @apply px-4 py-2 rounded-xl font-medium transition;
}
.btn-primary {
  @apply bg-pink-500 text-white hover:bg-pink-600;
}
</style>
