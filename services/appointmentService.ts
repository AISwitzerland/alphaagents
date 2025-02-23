import { supabase } from '@/lib/supabase';
import { EmailService } from './emailService';

interface AppointmentData {
  termin_datum: Date;
  name: string;
  email: string;
  telefon: string;
  notizen?: string;
}

export class AppointmentService {
  private static instance: AppointmentService;
  private emailService: EmailService;

  private constructor() {
    this.emailService = EmailService.getInstance();
  }

  static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }

  async createAppointment(data: AppointmentData) {
    try {
      // Create appointment in database
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          name: data.name,
          email: data.email,
          telefon: data.telefon,
          termin_datum: data.termin_datum.toISOString(),
          notizen: data.notizen,
          status: 'eingereicht'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw new Error('Failed to create appointment');
      }

      // Try to send confirmation email, but don't block appointment creation
      try {
        await this.emailService.sendAppointmentConfirmation(data);
      } catch (emailError) {
        // Log email error but don't fail the appointment creation
        console.error('Failed to send confirmation email:', emailError);
      }

      return appointment;
    } catch (err) {
      const error = err as Error;
      console.error('Failed to create appointment:', error);
      throw error;
    }
  }

  static async checkAvailability(date: Date): Promise<boolean> {
    // Get appointments for the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('termin_datum')
      .gte('termin_datum', startOfDay.toISOString())
      .lte('termin_datum', endOfDay.toISOString());

    if (error) {
      console.error('Error checking availability:', error);
      throw new Error('Fehler beim Prüfen der Verfügbarkeit');
    }

    // Assuming we allow 8 appointments per day
    return !existingAppointments || existingAppointments.length < 8;
  }

  static async getAvailableSlots(date: Date): Promise<Date[]> {
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('termin_datum')
      .eq('termin_datum::date', date.toISOString().split('T')[0]);

    if (error) {
      console.error('Error getting available slots:', error);
      throw new Error('Fehler beim Abrufen der verfügbaren Termine');
    }

    // Business hours: 9:00 - 17:00
    const slots: Date[] = [];
    const startHour = 9;
    const endHour = 17;
    const appointmentDuration = 60; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);

      // Check if slot is already taken
      const isSlotTaken = existingAppointments?.some(apt => 
        new Date(apt.termin_datum).getTime() === slotTime.getTime()
      );

      if (!isSlotTaken) {
        slots.push(slotTime);
      }
    }

    return slots;
  }
} 