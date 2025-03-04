'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Komponente für einen Einstellungsabschnitt
const SettingsSection = ({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

// Komponente für ein Einstellungsfeld
const SettingsField = ({ 
  label, 
  htmlFor,
  required = false,
  children 
}: { 
  label: string; 
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-5 last:mb-0">
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export default function SettingsPage() {
  // Status für Formularfelder
  const [name, setName] = useState('Max Mustermann');
  const [email, setEmail] = useState('max.mustermann@example.com');
  const [language, setLanguage] = useState('de');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true
  });
  const [theme, setTheme] = useState('system');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dummy-Funktion für das Speichern von Einstellungen
  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde normalerweise die Logik zum Speichern der Einstellungen stehen
    alert('Einstellungen gespeichert!');
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg">
        <div className="px-6 py-8 sm:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            Einstellungen
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-1 text-primary-100"
          >
            Passen Sie Ihr Konto und Ihre Präferenzen an
          </motion.p>
        </div>
      </div>

      {/* Einstellungsbereiche */}
      <div className="grid grid-cols-1 gap-8">
        {/* Profilinformationen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SettingsSection 
            title="Profilinformationen" 
            description="Verwalten Sie Ihre persönlichen Informationen"
          >
            <form onSubmit={saveSettings}>
              <SettingsField label="Name" htmlFor="name" required>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </SettingsField>
              
              <SettingsField label="E-Mail-Adresse" htmlFor="email" required>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </SettingsField>

              <SettingsField label="Sprache" htmlFor="language">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">Englisch</option>
                  <option value="fr">Französisch</option>
                </select>
              </SettingsField>

              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Speichern
                </button>
              </div>
            </form>
          </SettingsSection>
        </motion.div>

        {/* Benachrichtigungen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SettingsSection 
            title="Benachrichtigungen" 
            description="Stellen Sie ein, wie Sie benachrichtigt werden möchten"
          >
            <SettingsField label="E-Mail-Benachrichtigungen" htmlFor="email-notifications">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Erhalten Sie Benachrichtigungen per E-Mail bei neuen Dokumenten und Statusänderungen
                </span>
              </div>
            </SettingsField>

            <SettingsField label="SMS-Benachrichtigungen" htmlFor="sms-notifications">
              <div className="flex items-center">
                <input
                  id="sms-notifications"
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Erhalten Sie wichtige Benachrichtigungen per SMS
                </span>
              </div>
            </SettingsField>

            <SettingsField label="Browser-Benachrichtigungen" htmlFor="browser-notifications">
              <div className="flex items-center">
                <input
                  id="browser-notifications"
                  type="checkbox"
                  checked={notifications.browser}
                  onChange={(e) => setNotifications({...notifications, browser: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Erhalten Sie Echtzeit-Benachrichtigungen in Ihrem Browser
                </span>
              </div>
            </SettingsField>

            <div className="mt-6">
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Speichern
              </button>
            </div>
          </SettingsSection>
        </motion.div>

        {/* Anzeigeeinstellungen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SettingsSection 
            title="Anzeige" 
            description="Passen Sie an, wie die Anwendung für Sie angezeigt wird"
          >
            <SettingsField label="Thema" htmlFor="theme">
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`border ${theme === 'light' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'} rounded-md p-3 cursor-pointer`}
                  onClick={() => setTheme('light')}
                >
                  <div className="h-10 bg-white border border-gray-200 rounded mb-2"></div>
                  <div className="text-center text-sm font-medium">Hell</div>
                </div>
                <div 
                  className={`border ${theme === 'dark' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'} rounded-md p-3 cursor-pointer`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="h-10 bg-gray-800 rounded mb-2"></div>
                  <div className="text-center text-sm font-medium">Dunkel</div>
                </div>
                <div 
                  className={`border ${theme === 'system' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'} rounded-md p-3 cursor-pointer`}
                  onClick={() => setTheme('system')}
                >
                  <div className="h-10 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                  <div className="text-center text-sm font-medium">System</div>
                </div>
              </div>
            </SettingsField>

            <div className="mt-6">
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Speichern
              </button>
            </div>
          </SettingsSection>
        </motion.div>

        {/* Sicherheit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SettingsSection 
            title="Sicherheit" 
            description="Verwalten Sie Ihre Passwort- und Sicherheitseinstellungen"
          >
            <form onSubmit={saveSettings}>
              <SettingsField label="Aktuelles Passwort" htmlFor="old-password" required>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </SettingsField>
              
              <SettingsField label="Neues Passwort" htmlFor="new-password" required>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Passwort muss mindestens 8 Zeichen lang sein und Groß- und Kleinbuchstaben, Zahlen sowie Sonderzeichen enthalten.
                </p>
              </SettingsField>

              <SettingsField label="Passwort bestätigen" htmlFor="confirm-password" required>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </SettingsField>

              <div className="mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Passwort ändern
                </button>
              </div>
            </form>
          </SettingsSection>
        </motion.div>
      </div>
    </div>
  );
} 