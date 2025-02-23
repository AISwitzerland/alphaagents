import { useState } from 'react';
import { motion } from 'framer-motion';

interface AppointmentFormData {
  name: string;
  email: string;
  telefon: string;
  notizen?: string;
}

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

export function AppointmentForm({ onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    email: '',
    telefon: '',
    notizen: ''
  });

  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefonnummer ist erforderlich';
    } else if (!/^[+\d\s-()]{10,}$/.test(formData.telefon)) {
      newErrors.telefon = 'Ungültige Telefonnummer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
              ${errors.name ? 'border-red-300' : ''}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-Mail *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
              ${errors.email ? 'border-red-300' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefon *
          </label>
          <input
            type="tel"
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
              ${errors.telefon ? 'border-red-300' : ''}`}
          />
          {errors.telefon && (
            <p className="mt-1 text-sm text-red-600">{errors.telefon}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notizen
          </label>
          <textarea
            value={formData.notizen}
            onChange={(e) => setFormData({ ...formData, notizen: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Weiter
          </button>
        </div>
      </form>
    </motion.div>
  );
} 