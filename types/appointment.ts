export interface AppointmentData {
  termin_datum: Date;
  name: string;
  email: string;
  telefon: string;
  notizen?: string;
}

export interface AppointmentSlot {
  date: Date;
  isAvailable: boolean;
}

export type AppointmentStatus = 'eingereicht' | 'bestätigt' | 'storniert' | 'abgeschlossen';

export interface AppointmentRecord extends AppointmentData {
  id: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
} 