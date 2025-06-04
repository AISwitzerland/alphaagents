-- AlphaAgents Supabase Schema
-- Erstelle Tabellen für Termine und Offerten

-- APPOINTMENTS TABELLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('consultation', 'claim_review', 'contract_discussion', 'general')),
    preferred_date VARCHAR(100) NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    agent_id VARCHAR(255),
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- QUOTES TABELLE
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    insurance_type VARCHAR(100) NOT NULL CHECK (insurance_type IN ('krankenversicherung', 'unfallversicherung', 'haftpflichtversicherung', 'sachversicherung', 'lebensversicherung')),
    coverage_details JSONB,
    estimated_premium DECIMAL(10,2),
    premium_currency VARCHAR(10) DEFAULT 'CHF',
    coverage_amount DECIMAL(15,2),
    deductible DECIMAL(10,2),
    additional_info JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'calculated', 'sent', 'accepted', 'declined', 'expired')),
    valid_until TIMESTAMP WITH TIME ZONE,
    agent_id VARCHAR(255),
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger für updated_at bei appointments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_appointments_customer_email ON appointments(customer_email);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_insurance_type ON quotes(insurance_type);

-- Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies für service_role (Backend kann alles)
CREATE POLICY "Service role can do everything on appointments" ON appointments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on quotes" ON quotes
    FOR ALL USING (auth.role() = 'service_role');

-- Test-Daten einfügen (optional)
INSERT INTO appointments (customer_name, customer_email, customer_phone, appointment_type, preferred_date, preferred_time, reason) 
VALUES ('Test Kunde', 'test@example.com', '+41 44 123 45 67', 'consultation', 'Montag', '14:00', 'Allgemeine Beratung')
ON CONFLICT DO NOTHING;

-- Bestätige Schema-Erstellung
SELECT 'Appointments table created' as message 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments');

SELECT 'Quotes table created' as message 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quotes');