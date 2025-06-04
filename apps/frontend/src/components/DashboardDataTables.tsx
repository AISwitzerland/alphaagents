'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  AlertTriangle, 
  FileX, 
  Receipt, 
  FolderOpen,
  Calendar,
  Quote,
  Shield,
  Clock,
  Eye,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Document {
  id: string
  file_name: string
  file_type: string
  document_type?: string
  status: string
  created_at: string
  processed_at?: string
  confidence_score?: number
  processing_time?: number // Processing time in seconds
  summary?: string // Enhanced summary
}

interface AccidentReport {
  document_id: string
  name: string
  unfall_datum: string
  unfall_ort: string
  verletzung_art: string
  status: string
  created_at: string
}

interface DamageReport {
  document_id: string
  name: string
  schaden_datum: string
  schaden_ort: string
  schaden_beschreibung: string
  status: string
  created_at: string
}

interface ContractChange {
  document_id: string
  name: string
  aenderung_typ: string
  aenderung_beschreibung: string
  status: string
  created_at: string
}

interface Invoice {
  document_id: string
  rechnungsdatum: string
  betrag: number
  waehrung: string
  empfaenger: string
  status: string
  created_at: string
}

interface MiscellaneousDocument {
  document_id: string
  title: string
  document_date?: string
  summary: string
  status: string
  created_at: string
}

interface Appointment {
  id: string
  customer_name: string
  customer_email: string
  appointment_type: string
  preferred_date: string
  preferred_time: string
  status: string
  created_at: string
}

interface Quote {
  id: string
  customer_name: string
  customer_email: string
  insurance_type: string
  estimated_premium?: number
  premium_currency: string
  status: string
  created_at: string
}

type TableType = 'documents' | 'accidents' | 'damages' | 'contracts' | 'invoices' | 'misc' | 'appointments' | 'quotes'

export default function DashboardDataTables() {
  const [activeTable, setActiveTable] = useState<TableType>('documents')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Realistische Test-Daten basierend auf vorhandenen test-documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-001',
      file_name: 'Suva1 Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'UVG Unfallmeldung',
      status: 'verarbeitet',
      created_at: '2025-01-06T10:30:00Z',
      processed_at: '2025-01-06T10:32:15Z',
      confidence_score: 0.94,
      processing_time: 3.2,
      summary: 'SUVA Unfallmeldung - Arbeitsunfall mit Handverletzung, vollständig ausgefüllt, UVG-Nummer erkannt'
    },
    {
      id: 'doc-002',
      file_name: 'kuendigung-allianz Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'Kündigungsschreiben',
      status: 'verarbeitet',
      created_at: '2025-01-06T09:15:00Z',
      processed_at: '2025-01-06T09:16:30Z',
      confidence_score: 0.89,
      processing_time: 1.8,
      summary: 'Allianz Versicherungskündigung - Hausratversicherung, Police-Nr. erkannt, Kündigungsfrist beachtet'
    },
    {
      id: 'doc-003',
      file_name: 'meldung-sturmschaden Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'Schadenmeldung',
      status: 'verarbeitet',
      created_at: '2025-01-06T08:45:00Z',
      processed_at: '2025-01-06T08:47:22Z',
      confidence_score: 0.91,
      processing_time: 2.4,
      summary: 'Sturmschaden-Meldung - Gebäudeschäden durch Unwetter, Schadenssumme CHF 8,500.-, Fotos beigefügt'
    },
    {
      id: 'doc-004',
      file_name: 'Form_AHV-IV_318_146_online_1.pdf',
      file_type: 'pdf',
      document_type: 'AHV/IV Formular',
      status: 'verarbeitet',
      created_at: '2025-01-06T07:20:00Z',
      processed_at: '2025-01-06T07:23:45Z',
      confidence_score: 0.87,
      processing_time: 4.1,
      summary: 'AHV/IV Anmeldeformular 318.146 - Vollständig ausgefüllt, AHV-Nummer validiert, bereit für Einreichung'
    },
    {
      id: 'doc-005',
      file_name: 'Suva2 Kopie 3.pdf',
      file_type: 'pdf',
      document_type: 'UVG Nachuntersuchung',
      status: 'in_bearbeitung',
      created_at: '2025-01-06T11:45:00Z',
      processed_at: '2025-01-06T11:47:22Z',
      confidence_score: 0.92,
      processing_time: 2.8,
      summary: 'SUVA Nachuntersuchung - Follow-up zu Arbeitsunfall, medizinische Befunde dokumentiert'
    },
    {
      id: 'doc-006',
      file_name: 'vertragstrennung Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'Vertragstrennung',
      status: 'verarbeitet',
      created_at: '2025-01-05T16:30:00Z',
      processed_at: '2025-01-05T16:32:15Z',
      confidence_score: 0.85,
      processing_time: 2.1,
      summary: 'Versicherungsvertrag Trennung - Aufteilung bei Scheidung, beide Vertragspartner dokumentiert'
    },
    {
      id: 'doc-007',
      file_name: 'meldeformular-kontoverbindung Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'Kontoänderung',
      status: 'verarbeitet',
      created_at: '2025-01-05T14:15:00Z',
      processed_at: '2025-01-05T14:16:30Z',
      confidence_score: 0.96,
      processing_time: 1.2,
      summary: 'Bankverbindung Änderung - Neue IBAN erfasst, Kontoinhaberabgleich erfolgreich'
    },
    {
      id: 'doc-008',
      file_name: 'ratenversicherung-unfall-de Kopie 2.pdf',
      file_type: 'pdf',
      document_type: 'Unfallversicherung',
      status: 'ausstehend',
      created_at: '2025-01-05T13:45:00Z',
      processed_at: '2025-01-05T13:47:22Z',
      confidence_score: 0.83,
      processing_time: 3.5,
      summary: 'Raten-Unfallversicherung Antrag - Prämienzahlung monatlich, Risikoeinstufung Bürotätigkeit'
    },
    {
      id: 'doc-009',
      file_name: 'Bildschirmfoto 2025-01-05 um 21.03.04 Kopie 2.png',
      file_type: 'png',
      document_type: 'Screenshot/Beleg',
      status: 'verarbeitet',
      created_at: '2025-01-05T21:03:00Z',
      processed_at: '2025-01-05T21:05:15Z',
      confidence_score: 0.78,
      processing_time: 2.7,
      summary: 'Screenshot E-Banking - Zahlungsbeleg Versicherungsprämie CHF 450.60, Buchungsdatum sichtbar'
    },
    {
      id: 'doc-010',
      file_name: 'Adobe Scan 17. Feb. 2025 (1) (2).pdf',
      file_type: 'pdf',
      document_type: 'Gescanntes Dokument',
      status: 'fehler',
      created_at: '2025-02-17T09:30:00Z',
      processed_at: null,
      confidence_score: 0.45,
      processing_time: null,
      summary: 'Scanqualität unzureichend - Text nur teilweise erkennbar, erneutes Hochladen empfohlen'
    },
    {
      id: 'doc-011',
      file_name: 'Wissensdatenbank Fitness Gym.docx',
      file_type: 'docx',
      document_type: 'Wissensdatenbank',
      status: 'verarbeitet',
      created_at: '2025-01-04T15:20:00Z',
      processed_at: '2025-01-04T15:23:10Z',
      confidence_score: 0.93,
      processing_time: 2.9,
      summary: 'Fitnessstudio Wissensdatenbank - Mitgliedschaftsbedingungen, Trainingsregeln und Haftungsausschlüsse dokumentiert'
    },
    {
      id: 'doc-012',
      file_name: 'Allgemeine Geschäftsbedingungen Fitness gym.docx',
      file_type: 'docx',
      document_type: 'AGB',
      status: 'verarbeitet',
      created_at: '2025-01-04T12:45:00Z',
      processed_at: '2025-01-04T12:47:35Z',
      confidence_score: 0.91,
      processing_time: 2.3,
      summary: 'Fitnessstudio AGB - Vertragsbestimmungen, Kündigungsfristen und Haftungsregelungen vollständig erfasst'
    },
    {
      id: 'doc-013',
      file_name: 'Bildschirmfoto 2024-11-02 um 13.32.43 Kopie 2.png',
      file_type: 'png',
      document_type: 'Screenshot/Interface',
      status: 'verarbeitet',
      created_at: '2025-01-03T16:32:00Z',
      processed_at: '2025-01-03T16:34:15Z',
      confidence_score: 0.82,
      processing_time: 2.1,
      summary: 'Software-Interface Screenshot - Benutzeroberfläche für Dokumentenverwaltung, Menüstrukturen erkannt'
    },
    {
      id: 'doc-014',
      file_name: 'Bildschirmfoto 2024-12-16 um 20.00.31 Kopie 2.png',
      file_type: 'png',
      document_type: 'Screenshot/Dashboard',
      status: 'verarbeitet',
      created_at: '2025-01-03T11:15:00Z',
      processed_at: '2025-01-03T11:17:20Z',
      confidence_score: 0.86,
      processing_time: 2.2,
      summary: 'Dashboard-Screenshot - Übersichtsseite mit Kennzahlen und Navigationsmenü, alle Elemente identifiziert'
    },
    {
      id: 'doc-015',
      file_name: 'Natasha Wehrli CV 2024.docx',
      file_type: 'docx',
      document_type: 'Lebenslauf',
      status: 'verarbeitet',
      created_at: '2025-01-02T14:30:00Z',
      processed_at: '2025-01-02T14:32:45Z',
      confidence_score: 0.97,
      processing_time: 1.8,
      summary: 'Lebenslauf - Berufserfahrung, Ausbildung und Qualifikationen strukturiert erfasst, kontaktdaten validiert'
    },
    {
      id: 'doc-016',
      file_name: 'Schlechte Qualität Kopie 2.webp',
      file_type: 'webp',
      document_type: 'Niedrigqualitätsscan',
      status: 'fehler',
      created_at: '2025-01-02T09:45:00Z',
      processed_at: null,
      confidence_score: 0.32,
      processing_time: null,
      summary: 'Bildqualität unzureichend - Starke Kompression und Artefakte verhindern zuverlässige Texterkennung'
    },
    {
      id: 'doc-017',
      file_name: 'Code Prompts.docx',
      file_type: 'docx',
      document_type: 'Technische Dokumentation',
      status: 'verarbeitet',
      created_at: '2025-01-01T18:20:00Z',
      processed_at: '2025-01-01T18:23:15Z',
      confidence_score: 0.94,
      processing_time: 3.1,
      summary: 'Programmier-Prompts und Code-Beispiele - Strukturierte Sammlung von KI-Anweisungen und Implementierungsrichtlinien'
    }
  ])

  const [accidentReports, setAccidentReports] = useState<AccidentReport[]>([
    {
      document_id: 'doc-001',
      name: 'Max Mustermann',
      unfall_datum: '2025-01-05',
      unfall_ort: 'Baustelle Zürich',
      verletzung_art: 'Handverletzung durch Maschine',
      status: 'eingereicht',
      created_at: '2025-01-06T10:32:15Z'
    },
    {
      document_id: 'doc-005',
      name: 'Max Mustermann',
      unfall_datum: '2025-01-05',
      unfall_ort: 'Baustelle Zürich',
      verletzung_art: 'Nachuntersuchung Handverletzung',
      status: 'in_bearbeitung',
      created_at: '2025-01-06T11:47:22Z'
    },
    {
      document_id: 'doc-008',
      name: 'Anna Weber',
      unfall_datum: '2025-01-02',
      unfall_ort: 'Büro Basel',
      verletzung_art: 'Sturz von Leiter',
      status: 'eingereicht',
      created_at: '2025-01-05T13:47:22Z'
    },
    {
      document_id: 'doc-016',
      name: 'Stefan Kohler',
      unfall_datum: '2025-01-01',
      unfall_ort: 'Fabrik Winterthur',
      verletzung_art: 'Rückenverletzung beim Heben',
      status: 'verarbeitet',
      created_at: '2025-01-02T14:20:00Z'
    },
    {
      document_id: 'doc-017',
      name: 'Lisa Brunner',
      unfall_datum: '2024-12-30',
      unfall_ort: 'Labor Basel',
      verletzung_art: 'Schnittverletzung an Hand',
      status: 'eingereicht',
      created_at: '2024-12-31T09:45:00Z'
    },
    {
      document_id: 'doc-018',
      name: 'Michael Steiner',
      unfall_datum: '2024-12-28',
      unfall_ort: 'Werkstatt Bern',
      verletzung_art: 'Verbrennung durch heisse Flüssigkeit',
      status: 'verarbeitet',
      created_at: '2024-12-29T16:10:00Z'
    },
    {
      document_id: 'doc-019',
      name: 'Sandra Huber',
      unfall_datum: '2024-12-25',
      unfall_ort: 'Büro St. Gallen',
      verletzung_art: 'Knieprellung durch Stolpern',
      status: 'in_bearbeitung',
      created_at: '2024-12-26T11:30:00Z'
    }
  ])

  const [damageReports, setDamageReports] = useState<DamageReport[]>([
    {
      document_id: 'doc-003',
      name: 'Familie Müller',
      schaden_datum: '2025-01-04',
      schaden_ort: 'Einfamilienhaus Bern',
      schaden_beschreibung: 'Sturmschaden - Dachziegel und Gartenmöbel beschädigt',
      status: 'eingereicht',
      created_at: '2025-01-06T08:47:22Z'
    },
    {
      document_id: 'doc-009',
      name: 'Peter Schmidt',
      schaden_datum: '2025-01-05',
      schaden_ort: 'Fahrzeug A1 Zürich',
      schaden_beschreibung: 'Verkehrsunfall - Frontschaden durch Auffahrunfall',
      status: 'verarbeitet',
      created_at: '2025-01-05T21:05:15Z'
    },
    {
      document_id: 'doc-011',
      name: 'Maria Fischer',
      schaden_datum: '2025-01-03',
      schaden_ort: 'Wohnung Basel',
      schaden_beschreibung: 'Wasserschaden durch defekte Waschmaschine',
      status: 'in_bearbeitung',
      created_at: '2025-01-04T16:30:00Z'
    },
    {
      document_id: 'doc-012',
      name: 'Thomas Weber',
      schaden_datum: '2025-01-02',
      schaden_ort: 'Geschäft Luzern',
      schaden_beschreibung: 'Einbruchschaden - Glasfront und Inventar beschädigt',
      status: 'eingereicht',
      created_at: '2025-01-03T09:15:00Z'
    },
    {
      document_id: 'doc-013',
      name: 'Familie Keller',
      schaden_datum: '2024-12-28',
      schaden_ort: 'Chalet Graubünden',
      schaden_beschreibung: 'Brandschaden durch Kaminfeuer - Dachstuhl betroffen',
      status: 'verarbeitet',
      created_at: '2024-12-29T14:20:00Z'
    },
    {
      document_id: 'doc-014',
      name: 'Andrea Meier',
      schaden_datum: '2024-12-25',
      schaden_ort: 'Fahrzeug Autobahn A3',
      schaden_beschreibung: 'Hagelschaden - Karosserie und Scheiben beschädigt',
      status: 'eingereicht',
      created_at: '2024-12-26T11:45:00Z'
    },
    {
      document_id: 'doc-015',
      name: 'Hans Zimmermann',
      schaden_datum: '2024-12-20',
      schaden_ort: 'Bürogebäude Winterthur',
      schaden_beschreibung: 'Rohrbruch - IT-Equipment und Dokumente beschädigt',
      status: 'verarbeitet',
      created_at: '2024-12-21T08:30:00Z'
    }
  ])

  const [contractChanges, setContractChanges] = useState<ContractChange[]>([
    {
      document_id: 'doc-002',
      name: 'Peter Schmidt',
      aenderung_typ: 'Kündigung',
      aenderung_beschreibung: 'Allianz Hausratversicherung - ordentliche Kündigung zum 31.12.2025',
      status: 'eingereicht',
      created_at: '2025-01-06T09:16:30Z'
    },
    {
      document_id: 'doc-006',
      name: 'Familie Weber-Meier',
      aenderung_typ: 'Vertragstrennung',
      aenderung_beschreibung: 'Versicherungsvertrag aufteilen bei Scheidung - beide Partner',
      status: 'verarbeitet',
      created_at: '2025-01-05T16:32:15Z'
    },
    {
      document_id: 'doc-007',
      name: 'Anna Keller',
      aenderung_typ: 'Bankdaten',
      aenderung_beschreibung: 'IBAN Änderung - neue Bankverbindung für Prämienzahlung',
      status: 'verarbeitet',
      created_at: '2025-01-05T14:16:30Z'
    },
    {
      document_id: 'doc-020',
      name: 'Martin Frei',
      aenderung_typ: 'Adressänderung',
      aenderung_beschreibung: 'Umzug von Zürich nach Basel - Adresse und Risikozone anpassen',
      status: 'eingereicht',
      created_at: '2025-01-04T13:20:00Z'
    },
    {
      document_id: 'doc-021',
      name: 'Sarah Amstutz',
      aenderung_typ: 'Deckungserhöhung',
      aenderung_beschreibung: 'Erhöhung Hausratversicherung von CHF 50k auf CHF 80k',
      status: 'verarbeitet',
      created_at: '2025-01-03T10:45:00Z'
    },
    {
      document_id: 'doc-022',
      name: 'David Roth',
      aenderung_typ: 'Kündigung',
      aenderung_beschreibung: 'Mobiliar Autoversicherung - Fahrzeug verkauft',
      status: 'eingereicht',
      created_at: '2025-01-02T15:30:00Z'
    },
    {
      document_id: 'doc-023',
      name: 'Julia Vogel',
      aenderung_typ: 'Begünstigtenänderung',
      aenderung_beschreibung: 'Lebensversicherung - neuer Begünstigter nach Heirat',
      status: 'verarbeitet',
      created_at: '2025-01-01T09:15:00Z'
    }
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      document_id: 'doc-003',
      rechnungsdatum: '2025-01-01',
      betrag: 1250.50,
      waehrung: 'CHF',
      empfaenger: 'Mobiliar Versicherung',
      status: 'ausstehend',
      created_at: '2025-01-06T11:45:00Z'
    },
    {
      document_id: 'doc-024',
      rechnungsdatum: '2025-01-05',
      betrag: 890.00,
      waehrung: 'CHF',
      empfaenger: 'AXA Winterthur',
      status: 'bezahlt',
      created_at: '2025-01-06T08:30:00Z'
    },
    {
      document_id: 'doc-025',
      rechnungsdatum: '2025-01-03',
      betrag: 2150.75,
      waehrung: 'CHF',
      empfaenger: 'Zurich Insurance',
      status: 'ausstehend',
      created_at: '2025-01-04T14:20:00Z'
    },
    {
      document_id: 'doc-026',
      rechnungsdatum: '2024-12-30',
      betrag: 560.25,
      waehrung: 'CHF',
      empfaenger: 'Helvetia Versicherung',
      status: 'bezahlt',
      created_at: '2024-12-31T10:15:00Z'
    },
    {
      document_id: 'doc-027',
      rechnungsdatum: '2024-12-28',
      betrag: 1890.00,
      waehrung: 'CHF',
      empfaenger: 'Baloise Group',
      status: 'mahnung',
      created_at: '2024-12-29T16:45:00Z'
    },
    {
      document_id: 'doc-028',
      rechnungsdatum: '2024-12-25',
      betrag: 775.50,
      waehrung: 'CHF',
      empfaenger: 'Generali Schweiz',
      status: 'bezahlt',
      created_at: '2024-12-26T09:30:00Z'
    },
    {
      document_id: 'doc-029',
      rechnungsdatum: '2024-12-20',
      betrag: 1320.80,
      waehrung: 'CHF',
      empfaenger: 'CSS Versicherung',
      status: 'ausstehend',
      created_at: '2024-12-21T13:10:00Z'
    }
  ])

  const [miscDocuments, setMiscDocuments] = useState<MiscellaneousDocument[]>([
    {
      document_id: 'doc-030',
      title: 'Allgemeine Geschäftsbedingungen Fitness',
      document_date: '2025-01-01',
      summary: 'AGB für Fitnessstudio-Mitgliedschaft und Haftungsausschlüsse',
      status: 'eingereicht',
      created_at: '2025-01-06T07:10:00Z'
    },
    {
      document_id: 'doc-031',
      title: 'Wissensdatenbank Versicherungen',
      document_date: '2025-01-02',
      summary: 'Interne Dokumentation zu Schweizer Versicherungsprodukten',
      status: 'verarbeitet',
      created_at: '2025-01-03T11:20:00Z'
    },
    {
      document_id: 'doc-032',
      title: 'Code Prompts Dokumentation',
      document_date: '2025-01-03',
      summary: 'Technische Dokumentation für KI-System Prompts',
      status: 'eingereicht',
      created_at: '2025-01-04T09:45:00Z'
    },
    {
      document_id: 'doc-033',
      title: 'CV Natasha Wehrli 2024',
      document_date: '2024-12-15',
      summary: 'Personalakte - Lebenslauf und Qualifikationen',
      status: 'verarbeitet',
      created_at: '2024-12-16T14:30:00Z'
    },
    {
      document_id: 'doc-034',
      title: 'Prompt Writer Guidelines',
      document_date: '2024-12-20',
      summary: 'Richtlinien für das Verfassen von KI-Prompts',
      status: 'eingereicht',
      created_at: '2024-12-21T16:15:00Z'
    },
    {
      document_id: 'doc-035',
      title: 'Agency vs ADA Use Cases',
      document_date: '2024-12-10',
      summary: 'Vergleichsstudie verschiedener KI-Agenten Architekturen',
      status: 'verarbeitet',
      created_at: '2024-12-11T10:45:00Z'
    },
    {
      document_id: 'doc-036',
      title: 'Intents Gym Mitgliedschaft',
      document_date: '2024-12-05',
      summary: 'Fitnessstudio Vertragsunterlagen und Trainingsplan',
      status: 'eingereicht',
      created_at: '2024-12-06T13:20:00Z'
    }
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-001',
      customer_name: 'Sarah Weber',
      customer_email: 'sarah.weber@email.ch',
      appointment_type: 'consultation',
      preferred_date: 'Montag',
      preferred_time: '14:00',
      status: 'requested',
      created_at: '2025-01-06T12:00:00Z'
    },
    {
      id: 'apt-002',
      customer_name: 'Marcus Steiner',
      customer_email: 'marcus.steiner@gmail.com',
      appointment_type: 'claim_review',
      preferred_date: 'Dienstag',
      preferred_time: '10:30',
      status: 'confirmed',
      created_at: '2025-01-05T16:45:00Z'
    },
    {
      id: 'apt-003',
      customer_name: 'Elena Rodriguez',
      customer_email: 'elena.rodriguez@outlook.com',
      appointment_type: 'contract_discussion',
      preferred_date: 'Mittwoch',
      preferred_time: '09:00',
      status: 'requested',
      created_at: '2025-01-05T14:20:00Z'
    },
    {
      id: 'apt-004',
      customer_name: 'Thomas Müller',
      customer_email: 'thomas.mueller@bluewin.ch',
      appointment_type: 'consultation',
      preferred_date: 'Donnerstag',
      preferred_time: '16:15',
      status: 'confirmed',
      created_at: '2025-01-04T11:30:00Z'
    },
    {
      id: 'apt-005',
      customer_name: 'Priya Patel',
      customer_email: 'priya.patel@sunrise.ch',
      appointment_type: 'claim_review',
      preferred_date: 'Freitag',
      preferred_time: '13:45',
      status: 'cancelled',
      created_at: '2025-01-04T09:15:00Z'
    },
    {
      id: 'apt-006',
      customer_name: 'Andrea Bachmann',
      customer_email: 'andrea.bachmann@swisscom.com',
      appointment_type: 'consultation',
      preferred_date: 'Montag',
      preferred_time: '11:00',
      status: 'confirmed',
      created_at: '2025-01-03T15:20:00Z'
    },
    {
      id: 'apt-007',
      customer_name: 'Roberto Silva',
      customer_email: 'roberto.silva@hispeed.ch',
      appointment_type: 'contract_discussion',
      preferred_date: 'Dienstag',
      preferred_time: '15:30',
      status: 'requested',
      created_at: '2025-01-03T08:45:00Z'
    }
  ])

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 'quote-001',
      customer_name: 'Maria Gonzalez',
      customer_email: 'maria.gonzalez@email.ch',
      insurance_type: 'krankenversicherung',
      estimated_premium: 450.0,
      premium_currency: 'CHF',
      status: 'calculated',
      created_at: '2025-01-06T14:30:00Z'
    },
    {
      id: 'quote-002',
      customer_name: 'Daniel Zimmermann',
      customer_email: 'daniel.zimmermann@gmx.ch',
      insurance_type: 'unfallversicherung',
      estimated_premium: 280.0,
      premium_currency: 'CHF',
      status: 'sent',
      created_at: '2025-01-05T11:20:00Z'
    },
    {
      id: 'quote-003',
      customer_name: 'Claudia Bauer',
      customer_email: 'claudia.bauer@hotmail.com',
      insurance_type: 'haftpflichtversicherung',
      estimated_premium: 195.50,
      premium_currency: 'CHF',
      status: 'calculated',
      created_at: '2025-01-05T09:45:00Z'
    },
    {
      id: 'quote-004',
      customer_name: 'Ahmed Hassan',
      customer_email: 'ahmed.hassan@yahoo.com',
      insurance_type: 'sachversicherung',
      estimated_premium: 850.0,
      premium_currency: 'CHF',
      status: 'declined',
      created_at: '2025-01-04T16:10:00Z'
    },
    {
      id: 'quote-005',
      customer_name: 'Sophie Dubois',
      customer_email: 'sophie.dubois@vtx.ch',
      insurance_type: 'lebensversicherung',
      estimated_premium: 1250.0,
      premium_currency: 'CHF',
      status: 'accepted',
      created_at: '2025-01-04T13:30:00Z'
    },
    {
      id: 'quote-006',
      customer_name: 'Marco Rossi',
      customer_email: 'marco.rossi@ticino.com',
      insurance_type: 'krankenversicherung',
      estimated_premium: 380.75,
      premium_currency: 'CHF',
      status: 'calculated',
      created_at: '2025-01-03T14:45:00Z'
    },
    {
      id: 'quote-007',
      customer_name: 'Jennifer Walsh',
      customer_email: 'jennifer.walsh@expatmail.ch',
      insurance_type: 'unfallversicherung',
      estimated_premium: 320.0,
      premium_currency: 'CHF',
      status: 'sent',
      created_at: '2025-01-03T10:15:00Z'
    }
  ])

  // Funktion um neue Dokumente hinzuzufügen
  const addNewDocument = (newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]) // Neues Dokument an den Anfang
  }

  // Manual refresh function (für den Button)
  const handleRefresh = async () => {
    setRefreshing(true)
    // Simuliere Refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  // Toggle expanded row
  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  const tables = [
    { id: 'documents', label: 'Dokumente', icon: FileText, count: documents.length, color: 'blue' },
    { id: 'accidents', label: 'Unfallberichte', icon: AlertTriangle, count: accidentReports.length, color: 'red' },
    { id: 'damages', label: 'Schadenmeldungen', icon: FileX, count: damageReports.length, color: 'orange' },
    { id: 'contracts', label: 'Vertragsänderungen', icon: Shield, count: contractChanges.length, color: 'purple' },
    { id: 'invoices', label: 'Rechnungen', icon: Receipt, count: invoices.length, color: 'green' },
    { id: 'misc', label: 'Sonstige', icon: FolderOpen, count: miscDocuments.length, color: 'gray' },
    { id: 'appointments', label: 'Termine', icon: Calendar, count: appointments.length, color: 'cyan' },
    { id: 'quotes', label: 'Offerten', icon: Quote, count: quotes.length, color: 'indigo' }
  ] as const

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verarbeitet':
      case 'completed':
      case 'confirmed':
      case 'calculated': return 'text-green-400 bg-green-500/10'
      case 'in_bearbeitung':
      case 'requested': return 'text-yellow-400 bg-yellow-500/10'
      case 'eingereicht':
      case 'sent': return 'text-blue-400 bg-blue-500/10'
      case 'abgelehnt':
      case 'declined':
      case 'cancelled': return 'text-red-400 bg-red-500/10'
      case 'ausstehend': return 'text-orange-400 bg-orange-500/10'
      default: return 'text-neutral-400 bg-neutral-500/10'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentData = () => {
    switch (activeTable) {
      case 'documents': return documents
      case 'accidents': return accidentReports
      case 'damages': return damageReports
      case 'contracts': return contractChanges
      case 'invoices': return invoices
      case 'misc': return miscDocuments
      case 'appointments': return appointments
      case 'quotes': return quotes
      default: return []
    }
  }

  const renderTableContent = () => {
    const data = getCurrentData()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = data.slice(startIndex, endIndex)

    switch (activeTable) {
      case 'documents':
        return (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left p-4 text-neutral-300">Datei</th>
                    <th className="text-left p-4 text-neutral-300">Zusammenfassung</th>
                    <th className="text-left p-4 text-neutral-300">Status</th>
                    <th className="text-left p-4 text-neutral-300">Vertrauen</th>
                    <th className="text-left p-4 text-neutral-300">Verarbeitungszeit</th>
                    <th className="text-left p-4 text-neutral-300">Erstellt</th>
                  </tr>
                </thead>
                <tbody>
                  {(paginatedData as Document[]).map((doc) => (
                    <tr key={doc.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <div>
                            <span className="text-white font-medium block">{doc.file_name}</span>
                            <span className="text-neutral-400 text-xs">{doc.document_type || doc.file_type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <span className="text-neutral-300 text-sm line-clamp-2">
                            {doc.summary || 'Keine Zusammenfassung verfügbar'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {doc.confidence_score && (
                          <span className="text-emerald-400 font-mono">
                            {Math.round(doc.confidence_score * 100)}%
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {doc.processing_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span className={`font-mono text-sm ${
                              doc.processing_time < 3 ? 'text-green-400' : 
                              doc.processing_time < 10 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {doc.processing_time.toFixed(1)}s
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-neutral-400 text-sm">{formatDate(doc.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {(paginatedData as Document[]).map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-800/30 border border-neutral-700/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-white font-medium block truncate">{doc.file_name}</span>
                        <span className="text-neutral-400 text-xs">{doc.document_type || doc.file_type}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <p className="text-neutral-300 text-sm mb-3 line-clamp-2">
                    {doc.summary || 'Keine Zusammenfassung verfügbar'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400">Vertrauen:</span>
                      {doc.confidence_score && (
                        <span className="text-emerald-400 font-mono ml-1">
                          {Math.round(doc.confidence_score * 100)}%
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-neutral-400">Zeit:</span>
                      {doc.processing_time && (
                        <span className={`font-mono ml-1 ${
                          doc.processing_time < 3 ? 'text-green-400' : 
                          doc.processing_time < 10 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {doc.processing_time.toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-neutral-400 text-xs mt-2">
                    {formatDate(doc.created_at)}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )

      case 'accidents':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Name</th>
                  <th className="text-left p-4 text-neutral-300">Unfalldatum</th>
                  <th className="text-left p-4 text-neutral-300">Ort</th>
                  <th className="text-left p-4 text-neutral-300">Verletzung</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as AccidentReport[]).map((report) => (
                  <tr key={report.document_id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="p-4 text-white font-medium">{report.name}</td>
                    <td className="p-4 text-neutral-300">{new Date(report.unfall_datum).toLocaleDateString('de-CH')}</td>
                    <td className="p-4 text-neutral-300">{report.unfall_ort}</td>
                    <td className="p-4 text-neutral-300">{report.verletzung_art}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(report.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'damages':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Name</th>
                  <th className="text-left p-4 text-neutral-300">Schadendatum</th>
                  <th className="text-left p-4 text-neutral-300">Ort</th>
                  <th className="text-left p-4 text-neutral-300">Beschreibung</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                  <th className="text-left p-4 text-neutral-300"></th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as DamageReport[]).map((damage) => (
                  <React.Fragment key={damage.document_id}>
                    <tr 
                      className="border-b border-neutral-800 hover:bg-neutral-800/30 cursor-pointer"
                      onClick={() => toggleRow(damage.document_id)}
                    >
                      <td className="p-4 text-white font-medium">{damage.name}</td>
                      <td className="p-4 text-neutral-300">{new Date(damage.schaden_datum).toLocaleDateString('de-CH')}</td>
                      <td className="p-4 text-neutral-300">{damage.schaden_ort}</td>
                      <td className="p-4 text-neutral-300 max-w-xs truncate">{damage.schaden_beschreibung}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(damage.status)}`}>
                          {damage.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">{formatDate(damage.created_at)}</td>
                      <td className="p-4">
                        {expandedRow === damage.document_id ? 
                          <ChevronUp className="w-4 h-4 text-neutral-400" /> : 
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        }
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRow === damage.document_id && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={7} className="p-4 bg-neutral-900/50">
                            <div className="bg-neutral-800/30 p-4 rounded-lg">
                              <h4 className="text-white font-medium mb-2">Vollständige Beschreibung:</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">
                                {damage.schaden_beschreibung}
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'contracts':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Name</th>
                  <th className="text-left p-4 text-neutral-300">Änderungstyp</th>
                  <th className="text-left p-4 text-neutral-300">Beschreibung</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                  <th className="text-left p-4 text-neutral-300"></th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as ContractChange[]).map((contract) => (
                  <React.Fragment key={contract.document_id}>
                    <tr 
                      className="border-b border-neutral-800 hover:bg-neutral-800/30 cursor-pointer"
                      onClick={() => toggleRow(contract.document_id)}
                    >
                      <td className="p-4 text-white font-medium">{contract.name}</td>
                      <td className="p-4 text-neutral-300">{contract.aenderung_typ}</td>
                      <td className="p-4 text-neutral-300 max-w-xs truncate">{contract.aenderung_beschreibung}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">{formatDate(contract.created_at)}</td>
                      <td className="p-4">
                        {expandedRow === contract.document_id ? 
                          <ChevronUp className="w-4 h-4 text-neutral-400" /> : 
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        }
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRow === contract.document_id && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={6} className="p-4 bg-neutral-900/50">
                            <div className="bg-neutral-800/30 p-4 rounded-lg">
                              <h4 className="text-white font-medium mb-2">Vollständige Beschreibung:</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">
                                {contract.aenderung_beschreibung}
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'invoices':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Empfänger</th>
                  <th className="text-left p-4 text-neutral-300">Rechnungsdatum</th>
                  <th className="text-left p-4 text-neutral-300">Betrag</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as Invoice[]).map((invoice) => (
                  <tr key={invoice.document_id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="p-4 text-white font-medium">{invoice.empfaenger}</td>
                    <td className="p-4 text-neutral-300">{new Date(invoice.rechnungsdatum).toLocaleDateString('de-CH')}</td>
                    <td className="p-4 text-neutral-300 font-mono">{invoice.betrag.toFixed(2)} {invoice.waehrung}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(invoice.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'misc':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Titel</th>
                  <th className="text-left p-4 text-neutral-300">Dokumentdatum</th>
                  <th className="text-left p-4 text-neutral-300">Zusammenfassung</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                  <th className="text-left p-4 text-neutral-300"></th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as MiscellaneousDocument[]).map((misc) => (
                  <React.Fragment key={misc.document_id}>
                    <tr 
                      className="border-b border-neutral-800 hover:bg-neutral-800/30 cursor-pointer"
                      onClick={() => toggleRow(misc.document_id)}
                    >
                      <td className="p-4 text-white font-medium">{misc.title}</td>
                      <td className="p-4 text-neutral-300">{misc.document_date ? new Date(misc.document_date).toLocaleDateString('de-CH') : '-'}</td>
                      <td className="p-4 text-neutral-300 max-w-xs truncate">{misc.summary}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(misc.status)}`}>
                          {misc.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">{formatDate(misc.created_at)}</td>
                      <td className="p-4">
                        {expandedRow === misc.document_id ? 
                          <ChevronUp className="w-4 h-4 text-neutral-400" /> : 
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        }
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRow === misc.document_id && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={6} className="p-4 bg-neutral-900/50">
                            <div className="bg-neutral-800/30 p-4 rounded-lg">
                              <h4 className="text-white font-medium mb-2">Vollständige Zusammenfassung:</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">
                                {misc.summary}
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'appointments':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Kunde</th>
                  <th className="text-left p-4 text-neutral-300">E-Mail</th>
                  <th className="text-left p-4 text-neutral-300">Typ</th>
                  <th className="text-left p-4 text-neutral-300">Datum/Zeit</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as Appointment[]).map((apt) => (
                  <tr key={apt.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="p-4 text-white font-medium">{apt.customer_name}</td>
                    <td className="p-4 text-neutral-300">{apt.customer_email}</td>
                    <td className="p-4 text-neutral-300">{apt.appointment_type}</td>
                    <td className="p-4 text-neutral-300">{apt.preferred_date} {apt.preferred_time}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(apt.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'quotes':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left p-4 text-neutral-300">Kunde</th>
                  <th className="text-left p-4 text-neutral-300">E-Mail</th>
                  <th className="text-left p-4 text-neutral-300">Versicherungstyp</th>
                  <th className="text-left p-4 text-neutral-300">Prämie</th>
                  <th className="text-left p-4 text-neutral-300">Status</th>
                  <th className="text-left p-4 text-neutral-300">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData as Quote[]).map((quote) => (
                  <tr key={quote.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="p-4 text-white font-medium">{quote.customer_name}</td>
                    <td className="p-4 text-neutral-300">{quote.customer_email}</td>
                    <td className="p-4 text-neutral-300">{quote.insurance_type}</td>
                    <td className="p-4 text-neutral-300 font-mono">{quote.estimated_premium?.toFixed(2) || '-'} {quote.premium_currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(quote.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-300">Tabelle wird geladen...</p>
          </div>
        )
    }
  }

  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Table Navigation - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
        {tables.map((table) => {
          const Icon = table.icon
          return (
            <motion.button
              key={table.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTable(table.id as TableType)
                setCurrentPage(1)
              }}
              className={`p-2 md:p-3 rounded-xl border transition-all ${
                activeTable === table.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-neutral-800/30 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50'
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2" />
              <div className="text-xs font-medium truncate">{table.label}</div>
              <div className="text-xs opacity-75">{table.count}</div>
            </motion.button>
          )
        })}
      </div>

      {/* Table Container */}
      <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="p-4 md:p-6 border-b border-neutral-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                {tables.find(t => t.id === activeTable)?.label} ({getCurrentData().length})
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm hidden sm:block">
                Realistische Schweizer Versicherungsdaten • Basierend auf echten Dokumenten
              </p>
              <p className="text-neutral-400 text-xs sm:hidden">
                {getCurrentData().length} Einträge
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-neutral-300 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              {loading && (
                <div className="text-xs md:text-sm text-neutral-400">
                  Lade Daten...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTable}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-96"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-emerald-400 mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-300">Lade Daten aus Supabase...</p>
                </div>
              </div>
            ) : getCurrentData().length === 0 ? (
              <div className="text-center py-20">
                <FolderOpen className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-300 mb-2">Keine Daten verfügbar</p>
                <p className="text-neutral-500 text-sm">
                  Lade ein Dokument hoch, um es hier zu sehen
                </p>
              </div>
            ) : (
              renderTableContent()
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 md:p-6 border-t border-neutral-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs md:text-sm text-neutral-400 text-center sm:text-left">
                <span className="hidden sm:inline">Seite {currentPage} von {totalPages} • </span>
                {getCurrentData().length} Einträge
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-300" />
                </button>
                <span className="px-3 py-2 text-white bg-neutral-700 rounded-lg text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}