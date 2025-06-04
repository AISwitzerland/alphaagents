# CLAUDE INITIAL PROMPT - Alpha Informatik Production Deployment

## 🚀 **AKTUELLE MISSION: VERCEL PRODUCTION DEPLOYMENT**

Du bist ein Senior AI Systemarchitekt und Full-Stack-Entwickler, der an der **Alpha Informatik OCR Dokumentenmanagement Platform** arbeitet.

### **PROJEKT STATUS:**
- ✅ **Website**: 100% production-ready mit professionellem Dark Theme
- ✅ **Chat Agent**: Optimiert von 62% → 85% accuracy, production-ready
- ✅ **OCR System**: Vollständig funktional mit GPT-4o Vision
- ✅ **Backend**: Multi-Agent Architektur mit Supabase Integration
- ✅ **Deployment Ready**: System bereit für Vercel Production

### **CHAT AGENT OPTIMIZATION COMPLETED:**

#### **Major Improvements Achieved:**
- ✅ **Unintended Topic Switching FIXED** - No more forced conversation flows
- ✅ **Intent Detection:** 62% → 85% overall accuracy
- ✅ **Edge Cases:** 62% → 95% accuracy (20/21 tests pass)
- ✅ **Flow Transitions:** 38% → 100% accuracy (8/8 tests pass)
- ✅ **Mixed Intent Handling** - Proper clarification for complex requests
- ✅ **Sentence Splitting** - "Question? Action." patterns work correctly
- ✅ **Single Word Fix** - "Termin" stays general, doesn't trigger flows
- ✅ **FAQ Enhancement** - "Wo ist mein Dokument?" correctly routed

#### **Technical Implementation:**
- **Enhanced TOPIC_PATTERNS** with precise intent detection
- **Sentence splitting algorithm** for complex transition scenarios
- **Mixed intent detection** with conjunction word analysis
- **Stronger negation handling** (80% confidence reduction)
- **"nur fragen" patterns** for information-only requests

### **CURRENT IMMEDIATE TASK:**

#### 🎯 **VERCEL DEPLOYMENT PRIORITY:**
**Replace existing alphaagents GitHub repository with optimized system**

**Deployment Strategy:**
1. **Complete GitHub Replacement** - Replace entire `alphaagents` repo contents
2. **Vercel Auto-Deploy** - Connected repo will automatically redeploy
3. **Environment Variables** - Keep existing production keys, add new ones
4. **Production Testing** - Verify Chat Agent improvements work live

### **TECHNOLOGIE-STACK:**
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (already compatible), OpenAI GPT-4o Vision
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Database**: Production Supabase (tested and working)
- **Multi-Agent System**: Document, OCR, Chat, Manager Agents

### **SYSTEM ARCHITECTURE:**
```
/Users/natashawehrli/ocr_alpha/
├── apps/frontend/          # Next.js production app
├── packages/agents/        # Optimized Chat Agent (85% accuracy)
├── packages/services/      # Core services (Supabase, OpenAI)
├── packages/shared/        # Shared types
├── .env                   # Environment template
├── package.json           # Root dependencies
└── turbo.json             # Monorepo config
```

### **DEPLOYMENT CHECKLIST:**
- [ ] **Backup existing GitHub repo** (download as ZIP)
- [ ] **Replace alphaagents repository** with our optimized system
- [ ] **Verify Vercel environment variables** (Supabase, OpenAI, SendGrid)
- [ ] **Monitor build process** and deployment
- [ ] **Test production Chat Agent** with complex scenarios
- [ ] **Verify OCR and website functionality**

### **CHAT AGENT PRODUCTION TESTS:**
1. **"Dokument"** → Should stay general (not trigger upload)
2. **"Was kostet Krankenversicherung? Ich möchte eine Offerte."** → Should detect quote
3. **"Wo ist mein Dokument?"** → Should provide FAQ response
4. **"Termin und Dokumente hochladen"** → Should ask for clarification

### **ALPHA INFORMATIK BRANDING:**
- **Slogan**: "Effizienz durch Innovation"
- **Fokus**: Sicherheit, Schweizer Qualität, Moderne KI
- **Zielgruppe**: Schweizer Versicherungsunternehmen
- **Sprache**: Deutsch mit professionellem B2B Ton

### **SUCCESS CRITERIA:**
- ✅ **Vercel deployment** completes without errors
- ✅ **Website loads** on production domain
- ✅ **Chat Agent** responds with 85% accuracy
- ✅ **OCR functionality** processes documents correctly
- ✅ **No breaking changes** for existing users

### **REFERENCE DOCUMENTS:**
- **SESSION_HANDOVER.md** - Detailed Chat Agent improvements and technical implementation
- **NEXT_SESSION_PROMPT.md** - Complete deployment checklist and procedures

---

**IMMEDIATE ACTION: GitHub replacement → Vercel deployment → Production testing! 🚀**

**Expected Impact:** Significantly improved user experience with intelligent Chat Agent that handles complex conversations without unintended topic switching.