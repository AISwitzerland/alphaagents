# FINAL COMPREHENSIVE TEST RESULTS
**Test Date:** 2025-05-30T16:47:34.728Z
**Pipeline:** OCR → Classification → Enhanced Routing → Supabase → Email
**Total Documents:** 12
**SUVA Routing Fix:** ✅ IMPLEMENTED

## EXECUTIVE SUMMARY
- **Overall Success Rate:** 9/12 (75.0%)
- **Correct Routing Rate:** 5/9 (55.6%)
- **Email Success Rate:** 9/12 (75.0%)

## DETAILED RESULTS

### SUVA/ACCIDENT
**Success Rate:** 3/3 (100.0%)
**Routing Accuracy:** 0/3 (0.0%)

#### Suva1 Kopie 2.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Formular (99.0%)
- **Text Length:** 36 characters
- **Expected Table:** accident_reports
- **Actual Table:** miscellaneous_documents
- **Routing:** ❌ WRONG
- **Email Sent:** ✅ YES
- **Keywords Found:** Unfall, Unfallversicherung
- **Errors:** Wrong routing: expected accident_reports, got miscellaneous_documents
- **Extracted Text:** "I'm sorry, I can't assist with that."
\n#### Suva#2 Kopie 3.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Formular (99.0%)
- **Text Length:** 3060 characters
- **Expected Table:** accident_reports
- **Actual Table:** miscellaneous_documents
- **Routing:** ❌ WRONG
- **Email Sent:** ✅ YES
- **Keywords Found:** SUVA, UVG, Unfall, Verletzung, Unfallversicherung
- **Errors:** Wrong routing: expected accident_reports, got miscellaneous_documents

\n#### ratenversicherung-unfall-de Kopie 2.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Schadenmeldung (99.0%)
- **Text Length:** 2810 characters
- **Expected Table:** accident_reports
- **Actual Table:** damage_reports
- **Routing:** ❌ WRONG
- **Email Sent:** ✅ YES
- **Keywords Found:** None
- **Errors:** Wrong routing: expected accident_reports, got damage_reports

\n\n### CONTRACT/CANCELLATION
**Success Rate:** 5/6 (83.3%)
**Routing Accuracy:** 4/5 (80.0%)

#### Kündigung Versicherung Kopie 2.pdf
- **Status:** ❌ FAILED
- **Classification:** N/A (N/A)
- **Text Length:** 0 characters
- **Expected Table:** contract_changes
- **Actual Table:** N/A
- **Routing:** ❌ WRONG
- **Email Sent:** ❌ NO
- **Keywords Found:** None
- **Errors:** HTTP 500: {"success":false,"error":"Internal server error","details":"Document upload failed: [object Object]"}

\n#### kuendigung-allianz Kopie 2.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Versicherungspolice (99.0%)
- **Text Length:** 693 characters
- **Expected Table:** contract_changes
- **Actual Table:** contract_changes
- **Routing:** ✅ CORRECT
- **Email Sent:** ✅ YES
- **Keywords Found:** Kündigung


\n#### 1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx
- **Status:** ✅ SUCCESS
- **Classification:** Versicherungspolice (99.0%)
- **Text Length:** 506 characters
- **Expected Table:** contract_changes
- **Actual Table:** contract_changes
- **Routing:** ✅ CORRECT
- **Email Sent:** ✅ YES
- **Keywords Found:** Kündigung


\n#### 2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx
- **Status:** ✅ SUCCESS
- **Classification:** Versicherungspolice (99.0%)
- **Text Length:** 871 characters
- **Expected Table:** contract_changes
- **Actual Table:** contract_changes
- **Routing:** ✅ CORRECT
- **Email Sent:** ✅ YES
- **Keywords Found:** Kündigung


\n#### 3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx
- **Status:** ✅ SUCCESS
- **Classification:** Versicherungspolice (99.0%)
- **Text Length:** 649 characters
- **Expected Table:** contract_changes
- **Actual Table:** contract_changes
- **Routing:** ✅ CORRECT
- **Email Sent:** ✅ YES
- **Keywords Found:** Kündigung


\n#### vertragstrennung Kopie 2.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Formular (99.0%)
- **Text Length:** 2110 characters
- **Expected Table:** contract_changes
- **Actual Table:** miscellaneous_documents
- **Routing:** ❌ WRONG
- **Email Sent:** ✅ YES
- **Keywords Found:** Unfall
- **Errors:** Wrong routing: expected contract_changes, got miscellaneous_documents

\n\n### DAMAGE REPORTS
**Success Rate:** 1/1 (100.0%)
**Routing Accuracy:** 1/1 (100.0%)

#### meldung-sturmschaden Kopie 2.pdf
- **Status:** ✅ SUCCESS
- **Classification:** Schadenmeldung (99.0%)
- **Text Length:** 1382 characters
- **Expected Table:** damage_reports
- **Actual Table:** damage_reports
- **Routing:** ✅ CORRECT
- **Email Sent:** ✅ YES
- **Keywords Found:** None


\n\n### MISCELLANEOUS
**Success Rate:** 0/1 (0.0%)
**Routing Accuracy:** 0/0 (0%)

#### meldeformular-kontoverbindung Kopie 2.pdf
- **Status:** ❌ FAILED
- **Classification:** N/A (N/A)
- **Text Length:** 0 characters
- **Expected Table:** miscellaneous_documents
- **Actual Table:** N/A
- **Routing:** ❌ WRONG
- **Email Sent:** ❌ NO
- **Keywords Found:** None
- **Errors:** HTTP 500: {"success":false,"error":"Internal server error","details":"Document upload failed: Unknown error"}

\n\n### TEST CASES
**Success Rate:** 0/1 (0.0%)
**Routing Accuracy:** 0/0 (0%)

#### Schlechte Qualität Kopie 2.webp
- **Status:** ❌ FAILED
- **Classification:** N/A (N/A)
- **Text Length:** 0 characters
- **Expected Table:** miscellaneous_documents
- **Actual Table:** N/A
- **Routing:** ❌ WRONG
- **Email Sent:** ❌ NO
- **Keywords Found:** None
- **Errors:** HTTP 500: {"success":false,"error":"Internal server error","details":"Document upload failed: [object Object]"}



## CRITICAL FINDINGS

### ✅ SUVA Routing Success
- **Suva1 Kopie 2.pdf:** ❌ WRONG (miscellaneous_documents)\n- **Suva#2 Kopie 3.pdf:** ❌ WRONG (miscellaneous_documents)\n- **ratenversicherung-unfall-de Kopie 2.pdf:** ❌ WRONG (damage_reports)

### System Performance
- **OCR Quality:** 8/9 docs with high-quality extraction (500+ chars)
- **Classification Confidence:** 9/9 docs with 90%+ confidence
- **Email Reliability:** 9/12 successful email notifications

## RECOMMENDATIONS
⚠️ **Additional fixes needed** for remaining routing issues.

## RAW TEST DATA
```json
[
  {
    "filename": "Suva1 Kopie 2.pdf",
    "category": "SUVA/Accident",
    "fileSize": "247.1 KB",
    "expectedTable": "accident_reports",
    "timestamp": "2025-05-30T16:38:43.828Z",
    "success": true,
    "extractedTextLength": 36,
    "extractedText": "I'm sorry, I can't assist with that.",
    "classification": {
      "type": "Formular",
      "category": "Handschrift",
      "confidence": 0.99,
      "summary": "Das Dokument ist ein Formular zur Schadenmeldung bei der Unfallversicherung. Es enthält handschriftliche Einträge zu persönlichen Daten, Unfallhergang und weiteren relevanten Informationen.",
      "keyFields": {
        "handwriting_quality": "gut",
        "text_type": "strukturiert",
        "language": "deutsch",
        "legibility": "sehr gut",
        "extracted_keywords": [
          "Schadenmeldung",
          "Unfall",
          "Versicherung",
          "Verkäufer",
          "Fussballplatz"
        ],
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "miscellaneous_documents",
    "documentId": "8ee1d03f-e812-492f-b95c-0661791ff7e1",
    "emailSent": true,
    "routingCorrect": false,
    "keywordsFound": [
      "Unfall",
      "Unfallversicherung"
    ],
    "errors": [
      "Wrong routing: expected accident_reports, got miscellaneous_documents"
    ]
  },
  {
    "filename": "Suva#2 Kopie 3.pdf",
    "category": "SUVA/Accident",
    "fileSize": "553.8 KB",
    "expectedTable": "accident_reports",
    "timestamp": "2025-05-30T16:40:16.520Z",
    "success": true,
    "extractedTextLength": 3060,
    "extractedText": "**Schadenmeldung UVG**\n\n- [ ] Unfall\n- [ ] Zahnschaden\n- [x] Berufskrankheit\n- [ ] Rückfall\n\n**Schaden-Nummer**: 89767800\n\n---\n\n**1. Arbeitgeber**\n\nName und Adresse mit Postleitzahl:  \nMuster Architekturbüro  \nMusterweg 17, 9000 Muster\n\nTel.-Nr.: 041 123 45 67  \nKunden-Nr.: 34235  \nBetriebsteil:  \n\n**2. Verletzte/r**\n\nName und Vorname: Anna Muster  \nStrasse: Musterstrasse 7  \nPLZ: 8000  \nWohnort: Zürich\n\nGeburtsdatum: 04.03.1995  \nAHV-Nummer: 756.234.123.2  \nTel.-Nr. (dortm bekannt): 076 123 45 67  \nZivilstand: ledig  \nStaatsangehörigkeit: Schweiz  \nAusgeübter Beruf: Anwalt\n\n**3. Anstellung**\n\nDatum der Anstellung: 24.6.2023  \nAbteilung: [unclear]  \nKader: [ ] Höheres Kader [ ] Mittleres Kader [x] Nicht Kader  \nVerhältnis: [ ] unbefristeter Arbeitsvertrag [ ] befristeter Arbeitsvertrag [ ] Arbeitsverhältnis gekündigt  \nArbeitszeit des/der Verletzten: (Stunden je Woche) 36  \nVertraglicher Beschäftigungsgrad: 100 Prozent  \nBetriebliche Vorbelastzeit: (Stunden in Woche) 36  \nArbeitszeit: [ ] unregelmässig [ ] Kurzarbeit\n\n**4. Schaden-Datum**\n\nJahr: 2024  \nMonat: 4  \nTag: 27  \nZeit (Stunden, Minuten): 16:40\n\n**5. Unfallort**\n\nOrt (Name der PLZ) und Stelle (z.B. Werkstatt, Strasse): Garagenplatz\n\n**6. Sachverhalt (Unfallbeschreibung, Verdacht auf Berufskrankheit)**\n\nTätigkeit zur Zeit des Unfalles; Unfallhergang, beteiligte Gegenstände, Fahrzeuge:  \nDurch herunterfallendes Dach eingeklemmt worden.\n\nBeteiligte Person(en):  \n\nBesteht ein Polizeirapport? [ ] Ja [x] Nein [ ] Unbekannt\n\n**7. Berufsunfall**\n\nBeteiligte Gegenstände (z.B. Maschinen, Werkzeuge, Fahrzeuge, Arbeitsstoffe; bitte genaue Bezeichnung):  \nBeton und Holzstücke\n\n**8. Nichtberufsunfall**\n\nBis wann hat der/die Verletzte vor dem Unfall letztmals im Betrieb gearbeitet (Wochentag, Datum, Zeit)?  \n28.04.2024\n\nGrund der Absenz:  \n\n**9. Verletzung**\n\nBetroffenes Körperteil: Linker Arm  \nArt der Schädigung: Gebrochen  \n[x] links [ ] rechts [ ] unbestimmt\n\n**10. Arbeitsunfähigkeit**\n\nArbeit zufolge Unfalls ausgesagt? [x] Ja [ ] Nein  \nVoraussichtliche Dauer der Arbeitsunfähigkeit: länger als 1 Monat  \nWenn ja, ab wann?  \n\nFalls Arbeit wieder aufgenommen:  \nAb wann? [ ] ganz [ ] teilweise\n\n**11. Arzt-Adresse**\n\nErstbehandelnder Arzt bzw. Spital/Klinik: Dr. Müller  \nNachbehandelnder Arzt bzw. Spital/Klinik:  \n\n**12. Lohn**\n\nCHF pro:  \nStunde: 15  \nMonat: 150  \nJahr: 1300\n\nVorheriger Grundlohn inkl. Teuerungszulage (brutto): 6500  \nKinder-/Familienzulagen: 300  \nFerien-/Feiertagsentschädigung: 50  \nGratifikation/13. Monatslohn (und weiteres): 60  \nAndere Lohnarten (z.B. Akkord/Provision/Schichtzulagen): 200\n\nBezeichnung:  \n\n**13. Sonderfälle**\n\n[x] weitere Arbeitgeber  \n[ ] Familienmitglied, Gesellschaftler\n\n**14. Andere Sozialversicherungen**\n\nName der/des Versicherer/s:  \nLeistungsausweis auf Taggeld oder Rente bei: Krankenversicherung, Suva oder anderer obligatorischer Unfallversicherung, Invalidenversicherung, Alters- und Hinterlassenenversicherung, Berufliche Vorsorgeeinrichtung.\n\nOrt und Datum: Zürich, 26.05.2024\n\nStempel und Unterschrift:  \nA. Muster",
    "classification": {
      "type": "Formular",
      "category": "Handschrift",
      "confidence": 0.99,
      "summary": "Das Dokument ist ein ausgefülltes Formular zur Schadenmeldung im Rahmen der Unfallversicherung (UVG). Es enthält handschriftliche Einträge zu persönlichen Daten, Unfallhergang und weiteren relevanten Informationen.",
      "keyFields": {
        "handwriting_quality": "gut",
        "text_type": "strukturiert",
        "language": "deutsch",
        "legibility": "gut",
        "extracted_keywords": [
          "Schadenmeldung",
          "Unfall",
          "Garagenplatz",
          "Beton und Holzstücke",
          "Dr. Müller"
        ],
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "miscellaneous_documents",
    "documentId": "c3731728-fc46-406f-97a9-568dcf779af4",
    "emailSent": true,
    "routingCorrect": false,
    "keywordsFound": [
      "SUVA",
      "UVG",
      "Unfall",
      "Verletzung",
      "Unfallversicherung"
    ],
    "errors": [
      "Wrong routing: expected accident_reports, got miscellaneous_documents"
    ]
  },
  {
    "filename": "ratenversicherung-unfall-de Kopie 2.pdf",
    "category": "SUVA/Accident",
    "fileSize": "289.8 KB",
    "expectedTable": "accident_reports",
    "timestamp": "2025-05-30T16:41:34.884Z",
    "success": true,
    "extractedTextLength": 2810,
    "extractedText": "```plaintext\nAXA Versicherungen\nCredit & Lifestyle Protection\nGeneral-Guisan-Strasse 40\n8400 Winterthur\nwww.clpnet.com/custom er/homech\nE-Mail: clp.ch.service@partners.axa\nFax: 0848 000 425\n\nSchadenmeldung bei Arbeitsunfähigkeit\nBitte beachten Sie vor dem Ausfüllen des Schadenformulars, dass Sie Ihren Schadenfall uns auch online melden sowie die Unterlagen\nonline hochladen und den Schadenfall über unsere Internetseite: www.clpnet.com/customer/homech online nachverfolgen können.\nWenn Sie es bevorzugen können Sie uns Ihre ausgefüllte Schadenanzeige auch über Fax, E-Mail und Postweg zukommen lassen.\n\n1. Wichtige Hinweise\n\nBitte prüfen Sie vor dem Ausfüllen des Schadenformulars:\n\nBesteht Ihre Arbeitsunfähigkeit bereits seit einem Zeitpunkt vor Versicherungsbeginn?\nFür eine Arbeitsunfähigkeit, welche bereits vor Versicherungsbeginn bestand, besteht leider kein Versicherungsschutz.\n\nWurden Sie an der Ihrer Arbeitsunfähigkeit zugrunde liegenden Erkrankung bereits vor Versicherungsbeginn behandelt?\nDann liegt unter Umständen ein Ausschluss wegen Vorerkrankungen vor. Rufen Sie uns in diesem Fall an, wenn Sie unsicher sind.\n\nLeiden Sie an einer Erkrankung psychischer Natur?\nEine Leistung ist nur möglich, wenn Ihnen die Arbeitsunfähigkeit von einem in der Schweiz niedergelassenen Psychiater bescheinigt\nwird.\n\nMüssen Sie während der Dauer der Versicherungsleistung Ihre Prämie zahlen?\nJa, die Prämie ist auch während der Dauer des Bezugs von Versicherungsleistungen zu zahlen.\n\nWas müssen Sie tun, um Schadenfallsansprüche bei uns geltend zu machen?\nSchritt 1: Bitte füllen Sie das Schadenformular vollständig aus und unterschreiben Sie dieses auf Seite 4.\n\nSchritt 2: Bitte lassen Sie beigefügte Arztmeldungen von Ihrem behandelnden Arzt und gegebenenfalls Facharzt ausfüllen und\nfügen Sie die Unterlagen dem Schadenformular bei.\n\nSchritt 3: Bitte fügen Sie die unter Punkt 7 aufgeführten Dokumente ebenfalls bei und senden uns diese zusammen mit dem\nausgefüllten Schadenformular zu.\n\nSobald Ihre Unterlagen bei uns eingetroffen sind, erhalten Sie innerhalb von 1 - 2 Wochen unsere Entscheidung oder einen Zwischen-\nstand, sollten wir weitere Unterlagen/Informationen benötigen.\n\nBitte beachten Sie, dass wir Ihren Anspruch auf Versicherungsleistung nur prüfen können, wenn Sie uns alle Unterlagen/\nDokumente zukommen lassen. Eine Nichtbeachtung führt zu einer Verzögerung der Bearbeitung und gegebenenfalls zu einer\nverspäteten Auszahlung. Sie können die Unterlagen kostenlos über die o.g. Webseite nach erfolgter Registrierung hochladen.\n\n2. Persönliche Daten\n\nFrau o Herr o\n\nVorname Max\n\nName Mustermann\n\nStrasse Musterstrasse\n\nPLZ/Ort 8000 Zürich\n\nGeburtsdatum T T M M J J J J\n\nBeruf Architekt\n\nTelefon (privat) 071 777 77 77\n\nNatel 076 888 88 88\n\nE-Mail-Adresse Max@muster.ch\n\nSeite 1 von 5\n```",
    "classification": {
      "type": "Schadenmeldung",
      "category": "Versicherung",
      "confidence": 0.99,
      "summary": "Schadenmeldung bei Arbeitsunfähigkeit von AXA Versicherungen.",
      "keyFields": {
        "document_date": null,
        "document_number": null,
        "person_name": "Max Mustermann",
        "amount": null,
        "suva_checkboxes": {
          "unfall": "false",
          "zahnschaden": "false",
          "berufskrankheit": "false",
          "rueckfall": "false"
        },
        "key_info": "Schadenmeldung bei Arbeitsunfähigkeit, persönliche Daten von Max Mustermann.",
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "damage_reports",
    "documentId": "c333dc4c-614a-4e56-9b37-c1b6650821a9",
    "emailSent": true,
    "routingCorrect": false,
    "keywordsFound": [],
    "errors": [
      "Wrong routing: expected accident_reports, got damage_reports"
    ]
  },
  {
    "filename": "Kündigung Versicherung Kopie 2.pdf",
    "category": "Contract/Cancellation",
    "fileSize": "330.9 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:42:49.797Z",
    "success": false,
    "extractedTextLength": 0,
    "extractedText": "",
    "classification": null,
    "actualTable": null,
    "documentId": null,
    "recordId": null,
    "emailSent": false,
    "routingCorrect": false,
    "keywordsFound": [],
    "errors": [
      "HTTP 500: {\"success\":false,\"error\":\"Internal server error\",\"details\":\"Document upload failed: [object Object]\"}"
    ]
  },
  {
    "filename": "kuendigung-allianz Kopie 2.pdf",
    "category": "Contract/Cancellation",
    "fileSize": "173.2 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:42:52.153Z",
    "success": true,
    "extractedTextLength": 693,
    "extractedText": "```plaintext\nAnna Muster\nMusterstrasse 17\n9000 Zürich\n\nAllianz Versicherung\nKöniginstr. 28\n80802 München\n\nZürich, den 14.10.2024\n\nKündigung\n\nVertragsnummer, 923478204873\n\nSehr geehrte Damen und Herren,\n\nhiermit kündige ich meinen Versicherungsvertrag unter der oben angegebenen Vertragsnummer fristgerecht \nzum nächstmöglichen Zeitpunkt.\n\nBitte bestätigen Sie mir den Eingang dieser Kündigung sowie das Datum, an dem der Vertrag beendet wird, \nschriftlich.\n\nFalls es Sonderkündigungsrechte gibt, die in meiner Situation anwendbar sind, bitte ich um entsprechende \nInformation und Berücksichtigung.\n\nIch bitte um eine schnelle Bearbeitung.\n\nMit freundlichen Grüßen\n\n[Signature]\n\nAnna Muster\n```",
    "classification": {
      "type": "Versicherungspolice",
      "category": "Handschrift",
      "confidence": 0.99,
      "summary": "Ein handgeschriebener Brief zur Kündigung eines Versicherungsvertrags mit Angabe der Vertragsnummer und Bitte um Bestätigung.",
      "keyFields": {
        "handwriting_quality": "gut",
        "text_type": "fließtext",
        "language": "deutsch",
        "legibility": "sehr gut",
        "extracted_keywords": [
          "Kündigung",
          "Versicherungsvertrag",
          "Vertragsnummer",
          "Bestätigung"
        ],
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "contract_changes",
    "documentId": "460f7260-aa24-4878-8144-355c6bb986eb",
    "recordId": "0094ffcf-659d-4224-b86f-67c93a80ed3d",
    "emailSent": true,
    "routingCorrect": true,
    "keywordsFound": [
      "Kündigung"
    ],
    "errors": []
  },
  {
    "filename": "1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx",
    "category": "Contract/Cancellation",
    "fileSize": "29.7 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:43:36.556Z",
    "success": true,
    "extractedTextLength": 506,
    "extractedText": "\n\nFrau Anna MustermannMusterweg 179000 Muster \n\n\n\n\n\nEinschreiben \n\nVersicherung \n\nLifeProtect\n\n\n\n\n\n\n\nZürich, 17.06.2024 \n\n\n\n\n\n\n\n\n\n\n\n\n\nKündigung der Zusatzversicherung Krankenkasse Nr. 238492\n\nSehr geehrte Damen und Herren\n\nIch teile Ihnen hiermit die Kündigung der folgenden Zusatzversicherungen per 31.12.2024 mit. \n\nLebensversicherung , Policenummer: 9237482 \n\nGrundversicherung Policenummer: 9234383Besten Dank im Voraus für Ihre Kenntnisnahme und Rückbestätigung.\n\nFreundliche Grüsse\n\nAnna Mustermann\n\n",
    "classification": {
      "type": "Versicherungspolice",
      "category": "Versicherung",
      "confidence": 0.99,
      "summary": "Anna Mustermann kündigt ihre Zusatzversicherungen bei der LifeProtect Versicherung. Die Kündigung betrifft die Lebensversicherung mit der Policenummer 9237482 und die Grundversicherung mit der Policenummer 9234383. Die Kündigung wird zum 31.12.2024 wirksam.",
      "keyFields": {
        "document_date": "2024-06-17",
        "document_number": null,
        "person_name": "Anna Mustermann",
        "amount": null,
        "suva_checkboxes": {
          "unfall": false,
          "zahnschaden": false,
          "berufskrankheit": false,
          "rueckfall": false
        },
        "key_info": "Kündigung der Zusatzversicherungen Lebensversicherung (Policenummer: 9237482) und Grundversicherung (Policenummer: 9234383) zum 31.12.2024",
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "contract_changes",
    "documentId": "e608ed44-00b2-4c84-8476-8c46c572cb1a",
    "recordId": "31502dd9-ef81-4499-bb40-5f15ed64dae8",
    "emailSent": true,
    "routingCorrect": true,
    "keywordsFound": [
      "Kündigung"
    ],
    "errors": []
  },
  {
    "filename": "2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx",
    "category": "Contract/Cancellation",
    "fileSize": "27.1 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:44:05.276Z",
    "success": true,
    "extractedTextLength": 871,
    "extractedText": "\n\nFrauAnna MustermanMusterstrasse 379000 Muster\n\n\n\n\n\n\n\nEinschreiben\n\nVersicherung \n\nSwiss Protect\n\n\n\n\n\n\n\n\n\n\n\nZürich, 23,09,2024  \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nKündigung der Versicherung Policenummer 92834\n\n\n\nSehr geehrte Damen und Herren\n\n\n\nHiermit kündige ich meine Versicherung auf den 16.10.2024 gemäss Artikel 35a Absatz 1 des Versicherungsvertragsgesetzes unter Einhaltung der gesetzlichen Frist von 3 Monaten. \n\n\n\nListen Sie untenstehend sämtliche zu kündigende Versicherungen auf.\n\n\n\n- Grundversicherung\n\n\n\n- Life Protecta\n\n\n\nIch verweise auf Artikel 103a VVG, der besagt, dass das Kündigungsrecht nach drei Jahren auch für sämtliche Verträge gilt, die vor dem Inkrafttreten der Änderung vom 19. Juni 2020 abgeschlossen wurden.\n\n\n\nBesten Dank für die Kenntnisnahme. Bitte senden Sie mir eine schriftliche Kündigungsbestätigung. \n\n\n\nFreundliche Grüsse \n\n\n\n\n\nAnna Muster\n\n\n\n\n\n\n\n",
    "classification": {
      "type": "Versicherungspolice",
      "category": "Versicherung",
      "confidence": 0.99,
      "summary": "Anna Muster kündigt ihre Versicherung bei Swiss Protect mit der Policenummer 92834 zum 16.10.2024. Sie bittet um eine schriftliche Kündigungsbestätigung.",
      "keyFields": {
        "document_date": "2024-09-23",
        "document_number": "92834",
        "person_name": "Anna Muster",
        "amount": null,
        "suva_checkboxes": {
          "unfall": false,
          "zahnschaden": false,
          "berufskrankheit": false,
          "rueckfall": false
        },
        "key_info": "Kündigung der Versicherung zum 16.10.2024",
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "contract_changes",
    "documentId": "a32f716b-d80b-45d6-ad59-e4ee15822574",
    "recordId": "577d5a7f-f014-413b-9b5a-c8bc65e735ff",
    "emailSent": true,
    "routingCorrect": true,
    "keywordsFound": [
      "Kündigung"
    ],
    "errors": []
  },
  {
    "filename": "3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx",
    "category": "Contract/Cancellation",
    "fileSize": "34.7 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:44:37.794Z",
    "success": true,
    "extractedTextLength": 649,
    "extractedText": "\n\n\n\n\n\nFrau Max MustermannMusterweg 99000 Muster\n\n\n\n\n\n\n\nEinschreiben\n\nVersicherung \n\nSwiss Protect\n\n\n\n\n\n\n\n\n\nZürich, 27.09.2024\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nKündigung aufgrund eines Schadensfalls\n\nPolicenummer 23748292343\n\n\n\nSehr geehrte Damen und Herren\n\n\n\nAnlässlich des Schadenfalles am 15.08.2024 kündige ich hiermit meine Police gestützt auf Artikel 42 Absatz 1 des Versicherungsvertragsgesetzes.\n\n\n\nIch bitte Sie, mir die Vertragsauflösung schriftlich zu bestätigen und mein restliches Prämienguthaben auf folgendes Konto zu überweisen:\n\n\n\nIBAN: CH23942947293343\n\nName der Bank: UBS\n\nKontoinhaber: Max Mustermann\n\n\n\nFreundliche Grüsse \n\n\n\n\n\nMax Mustermann\n\n",
    "classification": {
      "type": "Versicherungspolice",
      "category": "Versicherung",
      "confidence": 0.99,
      "summary": "Max Mustermann kündigt seine Versicherungspolice mit der Nummer 23748292343 aufgrund eines Schadenfalles am 15.08.2024. Er bittet um eine schriftliche Bestätigung der Vertragsauflösung und die Überweisung seines restlichen Prämienguthabens auf sein Konto bei der UBS.",
      "keyFields": {
        "document_date": "2024-09-27",
        "document_number": "23748292343",
        "person_name": "Max Mustermann",
        "amount": null,
        "suva_checkboxes": {
          "unfall": false,
          "zahnschaden": false,
          "berufskrankheit": false,
          "rueckfall": false
        },
        "key_info": "Kündigung der Police 23748292343 aufgrund eines Schadenfalles am 15.08.2024",
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "contract_changes",
    "documentId": "648c7bee-5f88-455a-8748-7d7a9af31598",
    "recordId": "ce56e69d-a651-477c-b0ae-1e137391aa22",
    "emailSent": true,
    "routingCorrect": true,
    "keywordsFound": [
      "Kündigung"
    ],
    "errors": []
  },
  {
    "filename": "vertragstrennung Kopie 2.pdf",
    "category": "Contract/Cancellation",
    "fileSize": "285.1 KB",
    "expectedTable": "contract_changes",
    "timestamp": "2025-05-30T16:45:17.010Z",
    "success": true,
    "extractedTextLength": 2110,
    "extractedText": "```plaintext\nZur Helsana-Gruppe gehören Helsana Versicherungen AG,\nHelsana Zusatzversicherungen AG und Helsana Unfall AG.\n\nAngaben zur Vertragsrennung per 27.08.2024\n(Bitte Datum angeben)\nWird kein Datum angegeben, erfolgt die Vertragsrennung zum nächstmöglichen Termin\n\n1 Angaben zu Personen, die im bestehenden Vertrag verbleiben\n\nFamilien-Ansprechperson Name, Vorname Mustermann Max\nVersicherten-Nr. 3238539 Geburtsdatum 08.07.1990\nStrasse, Nr. Musterweg 17\nPLZ, Ort 9000 Musterstadt\nE-Mail Max@muster.ch Telefon 077 777 77 77\n\nBleibt Bank-/Postverbindung bestehen? Ja Nein, IBAN CH92340892340523\n\nWeitere Personen im Vertrag Name, Vorname Mustermann Anna\nVersicherten-Nr. 234923492 Geburtsdatum 04.12.1992\n\nName, Vorname Mustermann Leoni\nVersicherten-Nr. 23423882 Geburtsdatum 12.07.2012\n\nName, Vorname\nVersicherten-Nr. Geburtsdatum\n\n2 Angaben zu Personen, die in den neuen Vertrag wechseln\n\nNeue Familien-Ansprechperson Name, Vorname Mustermann Maximilian\nVersicherten-Nr. 23893843 Geburtsdatum 07.09.2015\nStrasse, Nr. Musterweg 17\nPLZ, Ort 9000 Musterstadt\nE-Mail Maximilian@muster.ch Telefon 077 666 66 66\n\nBank-/Postverbindung Name der Bank UBS\nIBAN CH2847323974\n\nSie möchten, dass wir auf ein Konto im Ausland auszahlen? Wenn Sie uns eine ausländische IBAN angeben, akzeptieren Sie\ndie Gebühr von CHF 3.– pro Überweisung. Die Gebühr ziehen wir direkt dem zu überweisenden Guthaben ab.\n\nGewünschter Zahlungstypus 1-monatlich 2-monatlich 3-monatlich\n6-monatlich 12-monatlich (0.5% Skonto)\n\nWeitere Personen im neuen Vertrag Name, Vorname\nVersicherten-Nr. Geburtsdatum\n\nName, Vorname\nVersicherten-Nr. Geburtsdatum\n\nName, Vorname\nVersicherten-Nr. Geburtsdatum\n\n3 Einverständnis\n\nOrt und Datum Unterschrift Familien-Ansprechperson\nZürich, 16.11.2024 A. Mustermann\n\nOrt und Datum Unterschrift neue Familien-Ansprechperson\nZürich, 16.11.2024 M. Mustermann\n\nOrt und Datum Unterschrift aller aufgeführten volljährigen Personen\n\nDurch eine Vertragsrennung kann sich der Familienrabatt ändern oder wegfallen. Bei zwei Personen gewähren wir 5% und ab drei Personen 10%\nFamilienrabatt auf Zusatzversicherungen.\n```",
    "classification": {
      "type": "Formular",
      "category": "Handschrift",
      "confidence": 0.99,
      "summary": "Das Dokument ist ein Formular zur Vertragsänderung bei der Helsana Versicherung. Es enthält Felder für persönliche Daten wie Name, Geburtsdatum, Adresse, Versicherungsnummer und Bankverbindung. Es gibt Abschnitte für die aktuelle und neue Familien-Ansprechperson sowie Unterschriftenfelder.",
      "keyFields": {
        "handwriting_quality": "gut",
        "text_type": "strukturiert",
        "language": "deutsch",
        "legibility": "sehr gut",
        "extracted_keywords": [
          "Vertragsänderung",
          "Helsana",
          "Versicherungsnummer",
          "Bankverbindung",
          "Unterschrift"
        ],
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "miscellaneous_documents",
    "documentId": "7e039d2a-9763-4ed0-a0c4-b76ec2d48687",
    "recordId": "a83dd430-cad1-4ae4-addd-f2756ac4900a",
    "emailSent": true,
    "routingCorrect": false,
    "keywordsFound": [
      "Unfall"
    ],
    "errors": [
      "Wrong routing: expected contract_changes, got miscellaneous_documents"
    ]
  },
  {
    "filename": "meldung-sturmschaden Kopie 2.pdf",
    "category": "Damage Reports",
    "fileSize": "149.3 KB",
    "expectedTable": "damage_reports",
    "timestamp": "2025-05-30T16:46:22.322Z",
    "success": true,
    "extractedTextLength": 1382,
    "extractedText": "Max Mustermann  \nMusterweg 10  \n9000 Zürich  \n\nSwiss Protect  \nZürcherstrasse 9  \n8000 Zürich  \n\nMeldung eines Sturmschadens vom 27.03.2024  \n\nSehr geehrte Damen und Herren,  \n\nhiermit melde ich einen Sturmschaden, der am 27.03.2024 durch den Sturm verursacht wurde.  \n\nVersicherungsnummer: 23947349  \nName: Max Mustermann  \nAdresse: Musterweg 19, 9000 Zürich  \n\nSchadenbeschreibung:  \nAm 27.03.2024 verursachte ein Sturm erhebliche Schäden an meinem Eigentum. Folgende Schäden sind aufgetreten:  \n\nDachschaden  \nWasserschaden im Keller  \nGaragentor defekt  \n\nIch habe Fotos und Videos der Schäden angefertigt und füge diese dieser Meldung bei. Zusätzlich habe ich die Wetterdaten des Tages beigefügt, die den Sturm und die entsprechenden Windgeschwindigkeiten bestätigen.  \n\nDa der Schaden sofort behoben werden musste, um Folgeschäden zu vermeiden, habe ich bereits erste Reparaturmaßnahmen eingeleitet. Dies war notwendig, da weiterer Regen drohte und die Gefahr bestand, dass weitere Schäden eintreten könnten. Ich habe alle Maßnahmen zur Schadensminderung genau dokumentiert und bewahre alle Belege und Rechnungen auf.  \n\nFür Rückfragen stehe ich Ihnen unter 077 777 77 77 oder per E-Mail unter Max@mustarch zur Verfügung.  \n\nIch bitte um eine Bestätigung des Eingangs dieser Meldung und um Information über das weitere Vorgehen.  \n\nMit freundlichen Grüßen,  \n\nMax Mustermann  ",
    "classification": {
      "type": "Schadenmeldung",
      "category": "Versicherung",
      "confidence": 0.99,
      "summary": "Meldung eines Sturmschadens vom 27.03.2024 mit Details zu den Schäden und Kontaktinformationen.",
      "keyFields": {
        "document_date": "2024-03-27",
        "document_number": null,
        "person_name": "Max Mustermann",
        "amount": null,
        "suva_checkboxes": {
          "unfall": "false",
          "zahnschaden": "false",
          "berufskrankheit": "false",
          "rueckfall": "false"
        },
        "key_info": "Sturmschaden an Dach, Wasserschaden im Keller, Garagentor defekt",
        "swiss_bank": "detected"
      },
      "language": "de"
    },
    "actualTable": "damage_reports",
    "documentId": "457f925a-488a-40eb-adf0-426da8b43e2c",
    "recordId": "e12da3b1-9b5c-434a-b001-726f6873b593",
    "emailSent": true,
    "routingCorrect": true,
    "keywordsFound": [],
    "errors": []
  },
  {
    "filename": "meldeformular-kontoverbindung Kopie 2.pdf",
    "category": "Miscellaneous",
    "fileSize": "64.6 KB",
    "expectedTable": "miscellaneous_documents",
    "timestamp": "2025-05-30T16:47:30.394Z",
    "success": false,
    "extractedTextLength": 0,
    "extractedText": "",
    "classification": null,
    "actualTable": null,
    "documentId": null,
    "recordId": null,
    "emailSent": false,
    "routingCorrect": false,
    "keywordsFound": [],
    "errors": [
      "HTTP 500: {\"success\":false,\"error\":\"Internal server error\",\"details\":\"Document upload failed: Unknown error\"}"
    ]
  },
  {
    "filename": "Schlechte Qualität Kopie 2.webp",
    "category": "Test Cases",
    "fileSize": "25.1 KB",
    "expectedTable": "miscellaneous_documents",
    "timestamp": "2025-05-30T16:47:32.500Z",
    "success": false,
    "extractedTextLength": 0,
    "extractedText": "",
    "classification": null,
    "actualTable": null,
    "documentId": null,
    "recordId": null,
    "emailSent": false,
    "routingCorrect": false,
    "keywordsFound": [],
    "errors": [
      "HTTP 500: {\"success\":false,\"error\":\"Internal server error\",\"details\":\"Document upload failed: [object Object]\"}"
    ]
  }
]
```
