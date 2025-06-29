import React, { useState } from 'react';
import { X, FileText, Plus, Edit3, Save, Trash2 } from 'lucide-react';
import { Category, Note } from '../types';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { generateId } from '../utils/helpers';

interface CategoryNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
}

export function CategoryNotesModal({ 
  isOpen, 
  onClose, 
  category, 
  notes, 
  onUpdateNotes 
}: CategoryNotesModalProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [noteViewMode, setNoteViewMode] = useState<'edit' | 'preview'>('edit');
  const [editingNoteViewMode, setEditingNoteViewMode] = useState<'edit' | 'preview'>('edit');

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: generateId(),
      content: newNoteContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onUpdateNotes([...notes, newNote]);
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
    setEditingNoteViewMode('edit');
  };

  const saveNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === noteId 
        ? { ...note, content: editingNoteContent.trim(), updatedAt: new Date() }
        : note
    );

    onUpdateNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const deleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      onUpdateNotes(updatedNotes);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{category.name} Notes</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} in this category
            </div>
            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingNoteViewMode('edit')}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            editingNoteViewMode === 'edit'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setEditingNoteViewMode('preview')}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            editingNoteViewMode === 'preview'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                    
                    {editingNoteViewMode === 'edit' ? (
                      <MarkdownEditor
                        value={editingNoteContent}
                        onChange={setEditingNoteContent}
                        placeholder="Write your note using markdown..."
                      />
                    ) : (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                        <MarkdownRenderer content={editingNoteContent} />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => saveNote(note.id)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditingNoteContent('');
                        }}
                        className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                          <span className="ml-2">(edited)</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEditingNote(note)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <MarkdownRenderer content={note.content} />
                  </>
                )}
              </div>
            ))}

            {isAddingNote && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">New Note</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setNoteViewMode('edit')}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        noteViewMode === 'edit'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setNoteViewMode('preview')}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        noteViewMode === 'preview'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                
                {noteViewMode === 'edit' ? (
                  <MarkdownEditor
                    value={newNoteContent}
                    onChange={setNewNoteContent}
                    placeholder="Write your note using markdown..."
                  />
                ) : (
                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 mb-3">
                    <MarkdownRenderer content={newNoteContent} />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={addNote}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNoteContent('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {notes.length === 0 && !isAddingNote && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No notes in this category yet
                </p>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create your first note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}