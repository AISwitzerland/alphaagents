export type SupportedLanguages = 'de' | 'en' | 'fr' | 'it';

export type DocumentStatus = 'eingereicht' | 'in_bearbeitung' | 'abgeschlossen' | 'archiviert' | 'storniert';

export * from './database';
export * from './document';
export * from './constants';
export * from './intent';
export * from './chat';
export * from './processing'; 