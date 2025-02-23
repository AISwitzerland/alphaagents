import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppointmentService } from '@/services/appointmentService';

interface AppointmentCalendarProps {
  onSelectSlot: (date: Date) => void;
  onBack: () => void;
}

export function AppointmentCalendar({ onSelectSlot, onBack }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appointmentService = AppointmentService.getInstance();

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const days: Date[] = [];
    
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const loadAvailableSlots = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      // Don't load slots for weekends
      if (isWeekend(date)) {
        setAvailableSlots([]);
      } else {
        const slots = await appointmentService.getAvailableSlots(date);
        setAvailableSlots(slots);
      }
    } catch (err) {
      setError('Fehler beim Laden der verfügbaren Termine');
      console.error('Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    await loadAvailableSlots(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Termin auswählen</h3>
        <p className="text-sm text-gray-500">Wählen Sie einen verfügbaren Termin aus</p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {generateCalendarDays().map((date, index) => (
          <button
            key={date.toISOString()}
            onClick={() => !isWeekend(date) && handleDateSelect(date)}
            disabled={isWeekend(date)}
            className={`p-2 text-center rounded-md transition-colors
              ${date.toDateString() === selectedDate?.toDateString()
                ? 'bg-primary-600 text-white'
                : isWeekend(date)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-primary-50'
              }`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && !isWeekend(selectedDate) && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Verfügbare Zeiten am {selectedDate.toLocaleDateString()}
          </h4>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.toISOString()}
                  onClick={() => onSelectSlot(slot)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-primary-50 transition-colors"
                >
                  {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Zurück
        </button>
      </div>
    </motion.div>
  );
} 