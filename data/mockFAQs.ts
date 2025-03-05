import { FAQ } from '@/types/faq';

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Was sind die Vorteile der Automatisierung von Geschäftsprozessen?',
    answer: 'Die Automatisierung von Geschäftsprozessen bietet zahlreiche Vorteile: Reduzierung manueller Arbeit, Minimierung von Fehlern, Kosteneinsparungen, Zeitersparnis, verbesserte Kundenerfahrung und Skalierbarkeit Ihres Unternehmens. Unsere Lösungen werden individuell auf Ihre Bedürfnisse zugeschnitten.',
    category: 'Allgemein',
    languages: {
      en: {
        question: 'What are the advantages of business process automation?',
        answer: 'Business process automation offers numerous benefits: reduction of manual work, error minimization, cost savings, time savings, improved customer experience, and scalability for your company. Our solutions are tailored to your specific needs.',
      },
      fr: {
        question: 'Quels sont les avantages de l\'automatisation des processus d\'entreprise?',
        answer: 'L\'automatisation des processus d\'entreprise offre de nombreux avantages: réduction du travail manuel, minimisation des erreurs, économies de coûts, gain de temps, amélioration de l\'expérience client et évolutivité de votre entreprise. Nos solutions sont adaptées à vos besoins spécifiques.',
      },
    },
  },
  {
    id: '2',
    question: 'Wie funktioniert der Dokumenten-Upload?',
    answer: 'Der Dokumenten-Upload ist einfach: Klicken Sie auf den Upload-Button oder ziehen Sie Ihre Dokumente direkt in das Chat-Fenster. Unterstützte Formate sind PDF, Word, Excel und Bilddateien. Ihre Dokumente werden sicher übertragen und gemäß Schweizer Datenschutzstandards verarbeitet.',
    category: 'Dokumente',
    languages: {
      en: {
        question: 'How does the document upload work?',
        answer: 'Document upload is simple: Click the upload button or drag your documents directly into the chat window. Supported formats are PDF, Word, Excel and image files. Your documents are securely transferred and processed according to Swiss data protection standards.',
      },
      fr: {
        question: 'Comment fonctionne le téléchargement de documents?',
        answer: 'Le téléchargement de documents est simple: cliquez sur le bouton de téléchargement ou faites glisser vos documents directement dans la fenêtre de discussion. Les formats pris en charge sont PDF, Word, Excel et les fichiers image. Vos documents sont transférés en toute sécurité et traités conformément aux normes suisses de protection des données.',
      },
    },
  },
  {
    id: '3',
    question: 'Wie vereinbare ich einen Beratungstermin?',
    answer: 'Einen Beratungstermin können Sie direkt hier im Chat vereinbaren. Klicken Sie auf "Termin vereinbaren" oder schreiben Sie mir, dass Sie einen Termin wünschen. Ich führe Sie durch den Prozess und Sie können einen passenden Zeitslot auswählen. Die Bestätigung erhalten Sie per E-Mail.',
    category: 'Beratung',
    languages: {
      en: {
        question: 'How do I schedule a consultation?',
        answer: 'You can schedule a consultation directly here in the chat. Click on "Schedule appointment" or write me that you would like an appointment. I will guide you through the process and you can select a suitable time slot. You will receive confirmation by email.',
      },
      fr: {
        question: 'Comment puis-je prendre rendez-vous pour une consultation?',
        answer: 'Vous pouvez prendre rendez-vous pour une consultation directement ici dans le chat. Cliquez sur "Prendre rendez-vous" ou écrivez-moi que vous souhaitez un rendez-vous. Je vous guiderai tout au long du processus et vous pourrez sélectionner un créneau horaire approprié. Vous recevrez une confirmation par e-mail.',
      },
    },
  },
  {
    id: '4',
    question: 'Welche IT-Automatisierungslösungen bietet Alpha Informatik an?',
    answer: 'Alpha Informatik bietet ein breites Spektrum an Automatisierungslösungen: RPA (Robotic Process Automation), KI-basierte Prozessoptimierung, Dokumentenmanagementsysteme, automatisierte Kundenservice-Lösungen und maßgeschneiderte Workflow-Automatisierungen. Wir passen unsere Lösungen an Ihre spezifischen Anforderungen an.',
    category: 'Dienstleistungen',
    languages: {
      en: {
        question: 'What IT automation solutions does Alpha Informatik offer?',
        answer: 'Alpha Informatik offers a wide range of automation solutions: RPA (Robotic Process Automation), AI-based process optimization, document management systems, automated customer service solutions, and custom workflow automations. We adapt our solutions to your specific requirements.',
      },
      fr: {
        question: 'Quelles solutions d\'automatisation informatique Alpha Informatik propose-t-elle?',
        answer: 'Alpha Informatik propose une large gamme de solutions d\'automatisation: RPA (Robotic Process Automation), optimisation des processus basée sur l\'IA, systèmes de gestion documentaire, solutions de service client automatisées et automatisations de flux de travail personnalisées. Nous adaptons nos solutions à vos besoins spécifiques.',
      },
    },
  },
  {
    id: '5',
    question: 'Wie kann ich mit Automatisierung Kosten sparen?',
    answer: 'Kostenersparnis durch Automatisierung entsteht auf mehreren Ebenen: Reduzierung von Personalkosten für repetitive Aufgaben, Minimierung von Fehlerkosten, schnellere Prozessabwicklung, optimierter Ressourceneinsatz und Skaleneffekte. In einer kostenlosen Erstberatung analysieren wir Ihr Einsparpotenzial.',
    category: 'Vorteile',
    languages: {
      en: {
        question: 'How can I save costs through automation?',
        answer: 'Cost savings through automation occur on multiple levels: reduction of personnel costs for repetitive tasks, minimization of error costs, faster process handling, optimized resource utilization, and economies of scale. In a free initial consultation, we analyze your savings potential.',
      },
      fr: {
        question: 'Comment puis-je économiser des coûts grâce à l\'automatisation?',
        answer: 'Les économies de coûts grâce à l\'automatisation se produisent à plusieurs niveaux: réduction des coûts de personnel pour les tâches répétitives, minimisation des coûts d\'erreur, traitement plus rapide des processus, utilisation optimisée des ressources et économies d\'échelle. Lors d\'une première consultation gratuite, nous analysons votre potentiel d\'économies.',
      },
    },
  },
]; 