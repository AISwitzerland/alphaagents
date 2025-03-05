'use client';

import { ChatUpload } from '@/components/chat/ChatUpload';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dokumente hochladen
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ChatUpload />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Hinweise</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Unterstützte Formate: PDF, Word, JPEG, PNG, TIFF</li>
              <li>• Maximale Dateigröße: 20MB</li>
              <li>• Bitte stellen Sie sicher, dass alle Dokumente lesbar sind</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 