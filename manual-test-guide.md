# 🧪 MANUAL BROWSER TEST GUIDE

## 🔍 **DIAGNOSE-ERGEBNIS:**

### **❌ Problem identifiziert:**
Der Chat Agent verliert den **Session-Kontext** zwischen Nachrichten. Jede neue Nachricht wird als neue Session behandelt, daher die wiederholten Begrüßungen.

### **🎯 MANUELLER TEST ERFORDERLICH:**

## 📝 **SCHRITT-FÜR-SCHRITT BROWSER-TEST:**

### **1. Frontend starten:**
```bash
cd /Users/natashawehrli/ocr_alpha/apps/frontend
npm run dev
```

### **2. Browser öffnen:**
```
http://localhost:3000
```

### **3. Chat öffnen und folgende Szenarien testen:**

---

## 🧪 **TEST 1: QUOTE FLOW (Krankenversicherung)**

**Nacheinander eingeben:**
```
1. "Ich möchte eine Offerte für eine Krankenversicherung"
   → Erwartung: Bot fragt nach Versicherungstyp oder Name

2. "Maria Test"  
   → Erwartung: Bot fragt nach E-Mail

3. "natashawehrli95@gmail.com"
   → Erwartung: Bot fragt nach Telefon

4. "+41 79 123 45 67"
   → Erwartung: Bot fragt nach Alter/Coverage

5. "Ich bin 30 Jahre alt und möchte Zusatzversicherung"
   → Erwartung: Bot generiert Offerte mit CHF-Betrag und Referenz
```

### **✅ ERFOLGS-INDIKATOREN:**
- ✅ Bot behält Kontext zwischen Nachrichten
- ✅ Keine wiederholten Begrüßungen
- ✅ CHF-Betrag wird angezeigt
- ✅ Referenz-Nummer wird generiert
- ✅ E-Mail-Versendung wird erwähnt

---

## 🧪 **TEST 2: APPOINTMENT FLOW (Termin)**

**Neue Chat-Session starten (Browser refresh):**
```
1. "Ich möchte einen Termin vereinbaren"
   → Erwartung: Bot fragt nach Name

2. "Thomas Test"
   → Erwartung: Bot fragt nach E-Mail

3. "natashawehrli95@gmail.com"  
   → Erwartung: Bot fragt nach Telefon

4. "+41 44 987 65 43"
   → Erwartung: Bot fragt nach Termintyp

5. "Allgemeine Beratung"
   → Erwartung: Bot fragt nach Wunschtermin

6. "Montag um 14 Uhr"
   → Erwartung: Bot erstellt Termin mit Referenz
```

### **✅ ERFOLGS-INDIKATOREN:**
- ✅ Schrittweise Datensammlung funktioniert
- ✅ Terminbestätigung mit Referenz-Nummer
- ✅ E-Mail-Bestätigung erwähnt

---

## 🧪 **TEST 3: DATA VALIDATION**

**Neue Chat-Session:**
```
1. "Offerte für Haftpflichtversicherung"
   → Erwartung: Bot startet Quote Flow

2. "Anna Validation"
   → Erwartung: Bot fragt nach E-Mail

3. "ungueltige-email"
   → Erwartung: Bot erkennt ungültige E-Mail und fragt nochmals

4. "natashawehrli95@gmail.com"
   → Erwartung: Bot akzeptiert E-Mail und fragt nach Telefon

5. "123"
   → Erwartung: Bot erkennt ungültige Telefonnummer

6. "+41 79 999 88 77"
   → Erwartung: Bot akzeptiert und setzt fort
```

---

## 🧪 **TEST 4: CONTEXT SWITCHING**

**Neue Chat-Session:**
```
1. "Sachversicherung Offerte"
   → Erwartung: Bot startet Quote Flow

2. "Max Wechsel"
   → Erwartung: Bot fragt nach E-Mail

3. "Eigentlich möchte ich einen Termin"
   → Erwartung: Bot wechselt elegant zu Appointment Flow

4. "Max Wechsel"
   → Erwartung: Bot fragt nach E-Mail (für Termin)

5. "natashawehrli95@gmail.com"
   → Erwartung: Bot setzt Terminbuchung fort
```

---

## 🔍 **DEBUGGING WÄHREND TEST:**

### **Browser Console öffnen (F12):**
- Prüfen Sie auf JavaScript-Fehler
- Schauen Sie nach Netzwerk-Fehlern bei `/api/chat`
- Achten Sie auf TypeScript-Compilerfehler

### **Bei Problemen prüfen:**

#### **1. Environment Variables:**
```bash
# .env.local prüfen
cat apps/frontend/.env.local | grep -E "(SUPABASE|OPENAI|RESEND)"
```

#### **2. TypeScript Errors:**
```bash
npx tsc --noEmit
```

#### **3. API Endpoint Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","chatId":"manual-test"}'
```

---

## 📧 **E-MAIL MONITORING:**

### **Nach erfolgreichen Tests prüfen:**

#### **natashawehrli95@gmail.com:**
- ✅ Kunden-Bestätigungen für Offerten
- ✅ Kunden-Bestätigungen für Termine
- ✅ Referenz-Nummern in E-Mails
- ✅ Professionelle HTML-Formatierung

#### **wehrlinatasha@gmail.com:**
- ✅ Staff-Benachrichtigungen für neue Offerten
- ✅ Staff-Benachrichtigungen für neue Termine
- ✅ Kundendaten in Benachrichtigungen
- ✅ Call-to-Action für Follow-up

---

## 📊 **ERWARTETE ERGEBNISSE:**

### **🎯 WENN ALLES FUNKTIONIERT:**
- ✅ Chat behält Kontext zwischen Nachrichten
- ✅ Flows werden komplett durchlaufen
- ✅ CHF-Beträge werden berechnet
- ✅ Referenz-Nummern werden generiert
- ✅ E-Mails werden versendet
- ✅ Schweizer Formate werden erkannt

### **⚠️ BEKANNTE PROBLEME:**
- ❌ Session-Kontext geht verloren (API-Problem)
- ❌ Wiederholte Begrüßungen
- ❌ Flows werden nicht fortgesetzt

---

## 🔧 **NEXT STEPS BASIEREND AUF TEST:**

### **WENN MANUEL TEST ERFOLGREICH:**
```
→ Problem ist nur in der automatischen Test-API
→ Chat Agent funktioniert im Browser korrekt
→ System ist produktionsreif
```

### **WENN MANUEL TEST AUCH FEHLSCHLÄGT:**
```
→ Session Management muss repariert werden
→ ChatInterface.tsx SessionId-Problem
→ API Route Session-Handling
```

---

## 🎯 **BITTE TESTEN SIE JETZT MANUELL:**

1. **Starten Sie das Frontend:** `npm run dev`
2. **Öffnen Sie:** http://localhost:3000
3. **Testen Sie Quote Flow** mit obigen Schritten
4. **Prüfen Sie beide E-Mail-Adressen**
5. **Berichten Sie mir die Ergebnisse**

**Ich erwarte, dass der manuelle Test erfolgreicher ist als der API-Test! 🎯**