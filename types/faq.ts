export interface FAQTranslation {
  question: string;
  answer: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  languages: {
    en?: FAQTranslation;
    fr?: FAQTranslation;
    it?: FAQTranslation;
  };
  tags?: string[];
  lastUpdated?: string;
} 