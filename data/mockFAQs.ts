import { FAQ } from '@/types/faq';

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Wie kann ich eine Schadensmeldung einreichen?',
    answer: 'Sie können eine Schadensmeldung über unser Online-Portal einreichen oder direkt mit unserem Chatbot beginnen. Laden Sie relevante Dokumente hoch und folgen Sie den Anweisungen.',
    category: 'Schadensmeldung',
    languages: {
      en: {
        question: 'How can I submit a claim?',
        answer: 'You can submit a claim through our online portal or start directly with our chatbot. Upload relevant documents and follow the instructions.',
      },
      fr: {
        question: 'Comment puis-je soumettre une déclaration de sinistre ?',
        answer: 'Vous pouvez soumettre une déclaration de sinistre via notre portail en ligne ou commencer directement avec notre chatbot. Téléchargez les documents pertinents et suivez les instructions.',
      },
    },
  },
  {
    id: '2',
    question: 'Wie funktioniert der Dokumenten-Upload?',
    answer: 'Der Dokumenten-Upload ist einfach: Wählen Sie die Datei aus oder ziehen Sie sie in das Upload-Feld. Unterstützt werden PDF, Word und Bilddateien bis 20MB.',
    category: 'Dokumente',
    languages: {
      en: {
        question: 'How does document upload work?',
        answer: 'Document upload is simple: Select the file or drag it into the upload field. Supported formats are PDF, Word and image files up to 20MB.',
      },
      fr: {
        question: 'Comment fonctionne le téléchargement de documents ?',
        answer: 'Le téléchargement de documents est simple : sélectionnez le fichier ou faites-le glisser dans le champ de téléchargement. Les formats PDF, Word et images jusqu\'à 20 Mo sont pris en charge.',
      },
    },
  },
  {
    id: '3',
    question: 'Wie vereinbare ich einen Beratungstermin?',
    answer: 'Beratungstermine können Sie direkt über unseren Chat-Assistenten oder im Kundenportal vereinbaren. Wählen Sie einen passenden Zeitslot und geben Sie Ihre Kontaktdaten ein.',
    category: 'Termine',
    languages: {
      en: {
        question: 'How do I schedule a consultation?',
        answer: 'You can schedule consultations directly through our chat assistant or in the customer portal. Select a suitable time slot and enter your contact details.',
      },
      fr: {
        question: 'Comment puis-je prendre rendez-vous pour une consultation ?',
        answer: 'Vous pouvez prendre rendez-vous directement via notre assistant de chat ou dans le portail client. Sélectionnez un créneau horaire qui vous convient et saisissez vos coordonnées.',
      },
    },
  },
]; 