# 🧪 AlphaAgents Chat System Testing Guide

## 🚀 Vollumfängliche Tests ausführen

### **Quick Start - Alle Tests auf einmal:**
```bash
cd /Users/natashawehrli/ocr_alpha
npx ts-node run-all-chat-tests.ts
```

### **Einzelne Test-Suites:**

#### 1. **Comprehensive Scenario Tests** (Haupt-Szenarien)
```bash
npx ts-node comprehensive-chat-test.ts
```
**Testet:**
- ✅ Perfekte Quote/Appointment Flows
- ✅ Schrittweise Datensammlung
- ✅ Vage Benutzerantworten
- ✅ Ungültige Daten-Behandlung
- ✅ Context Switching zwischen Topics
- ✅ Edge Cases (lange/kurze Antworten, Sprach-Mix)

#### 2. **Edge Case Validation Tests** (Spezifische Validierung)
```bash
npx ts-node edge-case-validation-test.ts
```
**Testet:**
- ✅ E-Mail Validierung (invalid/valid formats)
- ✅ Telefonnummer-Erkennung (CH-Formate)
- ✅ Altersextraktion aus Text
- ✅ Context Switching Logic
- ✅ Error Recovery

#### 3. **Simple Basic Test** (Schneller Check)
```bash
npx ts-node test-chat-appointments.ts
```
**Testet:**
- ✅ Basic Appointment Flow
- ✅ Basic Quote Flow
- ✅ Simple Context Switch
- ✅ Email Confirmations

---

## 📊 Was wird getestet?

### **🎯 Scenario Categories:**

#### **QUOTE SCENARIOS:**
1. **Perfect Flow:** Benutzer gibt alle Infos korrekt an
2. **Gradual Flow:** Benutzer gibt Infos stückchenweise
3. **Vague Responses:** Unklare/vage Antworten
4. **Invalid Data:** Falsche E-Mail/Telefon → Retry Logic
5. **Context Switch:** Wechsel zu Termin mitten in Offerte

#### **APPOINTMENT SCENARIOS:**
1. **Perfect Flow:** Komplette Terminbuchung
2. **Unclear Time:** Vage Zeitangaben
3. **Context Switch:** Wechsel zu Offerte mitten in Termin

#### **EDGE CASES:**
1. **Multiple Switches:** Mehrfache Topic-Wechsel
2. **Short Responses:** Minimale Ein-Wort-Antworten
3. **Long Responses:** Sehr ausführliche Texte
4. **Mixed Languages:** Deutsch/Englisch gemischt

### **🔬 Validation Tests:**

#### **E-MAIL VALIDATION:**
- ✅ `ungueltige@` → Fehlermeldung
- ✅ `test@domain` → Fehlermeldung
- ✅ `user@gmail.com` → Akzeptiert

#### **TELEFON VALIDATION:**
- ✅ `+41 79 123 45 67` → Akzeptiert
- ✅ `044 123 45 67` → Akzeptiert
- ✅ `123` → Fehlermeldung

#### **ALTER EXTRACTION:**
- ✅ "Ich bin 35 Jahre alt" → 35 extrahiert
- ✅ "42j" → 42 extrahiert
- ✅ "Alter: 50" → 50 extrahiert

---

## 📧 E-Mail Testing

**Nach Tests erhalten Sie E-Mails an:**
- 📧 **wehrlinatasha@gmail.com** (Staff Notifications)
- 📧 **Test-E-Mail-Adressen** (Customer Confirmations)

**E-Mail Inhalte prüfen:**
- ✅ Subject Lines korrekt
- ✅ Referenz-Nummern vorhanden
- ✅ HTML-Formatierung
- ✅ Kundendaten korrekt
- ✅ Call-to-Actions vorhanden

---

## 📊 Erfolgs-Metriken

### **Erwartete Erfolgsraten:**
- **Quote Flows:** > 90%
- **Appointment Flows:** > 90%
- **Context Switching:** > 85%
- **Data Validation:** > 95%
- **Email Delivery:** > 98%

### **Test Results Interpretation:**

#### **🎉 90%+ Success Rate:**
```
System ist produktionsreif!
Alle kritischen Flows funktionieren
```

#### **✅ 75-89% Success Rate:**
```
System funktioniert gut
Kleinere Verbesserungen möglich
```

#### **⚠️ < 75% Success Rate:**
```
System braucht Verbesserungen
Prüfen Sie failed scenarios
```

---

## 🔍 Troubleshooting

### **Tests schlagen fehl?**

#### 1. **Environment prüfen:**
```bash
# Frontend läuft?
cd apps/frontend && npm run dev

# Environment Variables gesetzt?
cat .env.local | grep -E "(SUPABASE|RESEND|OPENAI)"
```

#### 2. **Supabase Connection:**
```bash
# Test Supabase Connection
npx ts-node -e "
import { globalServices } from './apps/frontend/src/lib/services';
globalServices.getContainer().then(c => console.log('✅ Connected'))
.catch(e => console.log('❌ Failed:', e));
"
```

#### 3. **TypeScript Errors:**
```bash
npx tsc --noEmit
```

### **Häufige Probleme:**

#### **Problem: "Cannot resolve module"**
```bash
# Lösung: Dependencies installieren
npm install
```

#### **Problem: "Supabase connection failed"**
```bash
# Lösung: .env.local prüfen
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### **Problem: "Email sending failed"**
```bash
# Lösung: Resend API Key prüfen
echo $RESEND_API_KEY
```

---

## 🎯 Manuelle Browser Tests

**Nach erfolgreichen automatischen Tests:**

1. **Frontend starten:**
   ```bash
   cd apps/frontend && npm run dev
   ```

2. **Browser öffnen:**
   ```
   http://localhost:3000
   ```

3. **Chat testen:**
   - "Ich möchte eine Offerte"
   - "Ich brauche einen Termin"
   - Context Switching testen
   - Ungültige Daten eingeben

4. **E-Mails prüfen:**
   - wehrlinatasha@gmail.com für Notifications
   - Test-E-Mail-Adresse für Confirmations

---

## ✅ Pre-Production Checklist

Nach erfolgreichen Tests:

- [ ] Alle Tests > 85% Success Rate
- [ ] E-Mail Notifications funktionieren
- [ ] Supabase Daten werden gespeichert
- [ ] TypeScript Errors behoben
- [ ] Manual Browser Tests bestanden
- [ ] Responsive Design getestet
- [ ] Error Handling funktioniert

**System ist bereit für Produktions-Deployment! 🚀**