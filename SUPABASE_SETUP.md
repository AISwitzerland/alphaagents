# Supabase Setup für AlphaAgents Chat System

## 🗄️ **Datenbank-Tabellen erstellen**

### **Schritt 1: SQL Schema ausführen**

Gehen Sie zu Ihrer Supabase Console und führen Sie das folgende SQL aus:

```sql
-- Führen Sie den Inhalt von supabase-schema.sql aus
-- Datei: /Users/natashawehrli/ocr_alpha/supabase-schema.sql
```

**Oder kopieren Sie den Inhalt direkt:**

1. Öffnen Sie [Supabase Console](https://app.supabase.com)
2. Wählen Sie Ihr Projekt
3. Gehen Sie zu "SQL Editor"
4. Erstellen Sie eine neue Query
5. Kopieren Sie den gesamten Inhalt von `supabase-schema.sql`
6. Führen Sie die Query aus

### **Schritt 2: Tabellen verifizieren**

Nach dem Ausführen sollten Sie folgende Tabellen haben:

✅ **appointments** - Für Terminvereinbarungen
✅ **quotes** - Für Versicherungsofferten  
✅ **documents** - Bereits vorhanden für Dokumente

### **Schritt 3: Permissions prüfen**

Stellen Sie sicher, dass Ihr `service_role` Key Zugriff auf alle Tabellen hat:

```sql
-- Test Query um Zugriff zu prüfen
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM quotes;
```

## 📧 **E-Mail System (Resend)**

### **Benötigte Environment Variables:**

```bash
# In Ihrer .env.local Datei
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@alphaagents.ch
```

### **E-Mail Flow:**

1. **Kunde bucht Termin** → 2 E-Mails werden gesendet:
   - ✅ Bestätigung an Kunde
   - 📧 Benachrichtigung an wehrlinatasha@gmail.com

2. **Kunde fordert Offerte an** → 2 E-Mails werden gesendet:
   - ✅ Offerte an Kunde  
   - 📧 Benachrichtigung an wehrlinatasha@gmail.com

## 🧪 **System testen**

### **Schritt 1: Frontend starten**
```bash
cd /Users/natashawehrli/ocr_alpha/apps/frontend
npm run dev
```

### **Schritt 2: Chat Agent testen**
```bash
cd /Users/natashawehrli/ocr_alpha
npx ts-node test-chat-appointments.ts
```

### **Schritt 3: Manuelle Tests im Browser**

1. Gehen Sie zu http://localhost:3000
2. Testen Sie den Chat:
   - "Ich möchte einen Termin vereinbaren"
   - "Ich brauche eine Offerte für eine Krankenversicherung"
3. Vervollständigen Sie die Flows
4. Prüfen Sie Ihre E-Mails (wehrlinatasha@gmail.com)

## 📊 **Datenbank überwachen**

### **Neue Termine anzeigen:**
```sql
SELECT 
  customer_name,
  customer_email, 
  appointment_type,
  preferred_date,
  preferred_time,
  status,
  created_at
FROM appointments 
ORDER BY created_at DESC 
LIMIT 10;
```

### **Neue Offerten anzeigen:**
```sql
SELECT 
  customer_name,
  customer_email,
  insurance_type,
  estimated_premium,
  status,
  created_at
FROM quotes 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚨 **Troubleshooting**

### **Problem: Tabellen existieren nicht**
- Führen Sie `supabase-schema.sql` nochmals aus
- Prüfen Sie RLS Policies

### **Problem: E-Mails werden nicht gesendet**
- Prüfen Sie RESEND_API_KEY in .env.local
- Prüfen Sie Logs in der Console

### **Problem: TypeScript Errors**
```bash
cd /Users/natashawehrli/ocr_alpha
npx tsc --noEmit
```

## ✅ **Erfolgskontrolle**

Das System funktioniert korrekt wenn:

1. ✅ Termine werden in `appointments` Tabelle gespeichert
2. ✅ Offerten werden in `quotes` Tabelle gespeichert  
3. ✅ Bestätigungs-E-Mails an Kunden gesendet
4. ✅ Benachrichtigungs-E-Mails an wehrlinatasha@gmail.com gesendet
5. ✅ Chat Agent erkennt Themenwechsel nahtlos
6. ✅ Referenz-Nummern werden generiert
7. ✅ Schweizer Telefonnummern werden erkannt

**Bei Problemen:** Prüfen Sie die Logs in der Browser Console und im Terminal.