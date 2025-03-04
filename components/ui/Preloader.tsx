'use client';

import { useState, useEffect } from 'react';

// Liste der wichtigsten Bilder, die vorgeladen werden sollen
const CRITICAL_IMAGES = [
  '/images/landing/famillie.jpg'
  // Hier können weitere wichtige Bilder hinzugefügt werden
];

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Funktion zum Laden aller kritischen Bilder
    const preloadImages = () => {
      const imagePromises = CRITICAL_IMAGES.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      return Promise.all(imagePromises);
    };

    // Funktion zum Überprüfen, ob alle Ressourcen geladen sind
    const handleLoad = async () => {
      try {
        // Erst die kritischen Bilder vorladen
        await preloadImages();
        
        // Dann kurze Verzögerung für sicheres Laden aller Komponenten
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Fehler beim Vorausladen von Bildern:', error);
        // Bei Fehlern trotzdem fortfahren
        setIsLoading(false);
      }
    };

    // Wenn das Fenster bereits geladen ist
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center transition-opacity duration-300"
      style={{ opacity: isLoading ? 1 : 0 }}
    >
      {/* Optional: Hier könnte ein Logo oder ein Ladeindikator eingefügt werden */}
    </div>
  );
} 