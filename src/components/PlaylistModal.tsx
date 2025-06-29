import React, { useState } from 'react';
import { X, Music, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { Playlist } from '../types';
import { generateId } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: Playlist;
  onSavePlaylist: (playlist: Playlist) => void;
  onRemovePlaylist?: () => void;
}

export function PlaylistModal({ 
  isOpen, 
  onClose, 
  playlist, 
  onSavePlaylist, 
  onRemovePlaylist 
}: PlaylistModalProps) {
  const [name, setName] = useState(playlist?.name || '');
  const [url, setUrl] = useState(playlist?.url || '');
  const { t } = useLanguage();

  const detectPlatform = (url: string): 'spotify' | 'youtube' | 'apple' | 'other' => {
    if (url.includes('spotify.com')) return 'spotify';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('music.apple.com')) return 'apple';
    return 'other';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const newPlaylist: Playlist = {
      id: playlist?.id || generateId(),
      name: name.trim(),
      url: url.trim(),
      platform: detectPlatform(url.trim()),
      createdAt: playlist?.createdAt || new Date(),
    };

    onSavePlaylist(newPlaylist);
    
    if (!playlist) {
      setName('');
      setUrl('');
    }
    onClose();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'spotify': return '🎵';
      case 'youtube': return '📺';
      case 'apple': return '🍎';
      default: return '🎶';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>{playlist ? t('playlist.title') : t('playlist.add')}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="playlistUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('playlist.url')} *
            </label>
            <input
              type="url"
              id="playlistUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('playlist.urlPlaceholder')}
              required
              autoFocus
            />
            {url && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{getPlatformIcon(detectPlatform(url))}</span>
                <span className="capitalize">{detectPlatform(url)} playlist</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="playlistName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('playlist.name')} *
            </label>
            <input
              type="text"
              id="playlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('playlist.namePlaceholder')}
              required
            />
          </div>

          {url && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlatformIcon(detectPlatform(url))}</span>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Preview playlist
                  </span>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            {playlist && onRemovePlaylist && (
              <button
                type="button"
                onClick={() => {
                  onRemovePlaylist();
                  onClose();
                }}
                className="px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('playlist.remove')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              {t('playlist.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}