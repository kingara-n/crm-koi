-- Initial Schema for Koi Travel CRM

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'sales_marketing', 'accounting', 'operations');
CREATE TYPE client_type AS ENUM ('corporate', 'leisure');
CREATE TYPE supplier_status AS ENUM ('pending_approval', 'active');
CREATE TYPE quotation_stage AS ENUM ('new_request', 'acknowledged', 'details_captured', 'quotation_in_progress', 'quotation_sent', 'client_feedback', 'revising', 'confirmed', 'invoiced', 'deposit_paid', 'lost');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- USERS (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'operations',
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  country TEXT,
  destinations TEXT[],
  passport_number TEXT,
  passport_expiry DATE,
  seat_preference TEXT,
  meal_preference TEXT,
  medical_notes TEXT,
  date_of_birth DATE,
  bio_notes TEXT,
  client_type client_type DEFAULT 'leisure',
  assigned_consultant_id UUID REFERENCES public.users(id),
  source_channel TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIPS
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  group_representative_id UUID REFERENCES public.clients(id),
  broadcast_to_all BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIP PARTICIPANTS (Many-to-Many Client <-> Trip)
CREATE TABLE public.trip_participants (
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  passport_number TEXT,
  seat_preference TEXT,
  meal_preference TEXT,
  medical_notes TEXT,
  PRIMARY KEY (trip_id, client_id)
);

-- SUPPLIERS
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- luxury, budget, etc.
  accounts_email TEXT,
  reservations_email TEXT,
  payment_terms TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  cancellation_policy TEXT,
  child_policy TEXT,
  capacity TEXT,
  amenities TEXT[],
  blackout_dates DATE[],
  status supplier_status DEFAULT 'pending_approval',
  submitted_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RATE SHEETS
CREATE TABLE public.rate_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  season_start DATE,
  season_end DATE,
  resident_rate NUMERIC,
  non_resident_rate NUMERIC,
  currency TEXT DEFAULT 'USD',
  file_url TEXT,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTRACTS (Polymorphic)
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('client', 'supplier')),
  entity_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTS (Polymorphic)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('client', 'trip', 'supplier')),
  entity_id UUID NOT NULL,
  type TEXT NOT NULL, -- passport, contract, etc.
  file_url TEXT NOT NULL,
  expiry_date DATE,
  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTATIONS
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  trip_id UUID REFERENCES public.trips(id),
  consultant_id UUID REFERENCES public.users(id),
  source_channel TEXT,
  stage quotation_stage DEFAULT 'new_request',
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  progress_percentage INTEGER DEFAULT 0,
  loss_reason TEXT,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES (AR)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  trip_id UUID REFERENCES public.trips(id),
  currency TEXT DEFAULT 'USD',
  exchange_rate_used NUMERIC,
  due_date DATE,
  status invoice_status DEFAULT 'draft',
  payment_terms TEXT,
  kra_pin TEXT,
  tax_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICE LINE ITEMS
CREATE TABLE public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

-- PURCHASE ORDERS (AP)
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id),
  trip_id UUID REFERENCES public.trips(id),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  status invoice_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('invoice', 'purchase_order')),
  entity_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXCHANGE RATES
CREATE TABLE public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_pair TEXT NOT NULL, -- e.g., USD_KES
  rate NUMERIC NOT NULL,
  effective_month DATE NOT NULL,
  set_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TAGS/MENTIONS
CREATE TABLE public.tags_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id),
  target_user_id UUID REFERENCES public.users(id),
  target_record_type TEXT NOT NULL,
  target_record_id UUID NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  source TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  is_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPROVAL REQUESTS
CREATE TABLE public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_record_type TEXT NOT NULL,
  target_record_id UUID NOT NULL,
  requested_by UUID REFERENCES public.users(id),
  required_approval_level INTEGER DEFAULT 1,
  status approval_status DEFAULT 'pending',
  diff_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPROVAL LOG
CREATE TABLE public.approval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.approval_requests(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL, -- 'approved' or 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  diff_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENT FEEDBACK NOTES
CREATE TABLE public.client_feedback_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  note TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BASIC RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: Complex RLS policies mapping to the role matrix will be implemented in subsequent queries or functions.
-- For now, allowing all authenticated users to read (as a starting point).
CREATE POLICY "Allow authenticated read" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON public.trips FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON public.suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read" ON public.quotations FOR SELECT USING (auth.role() = 'authenticated');

-- Audit logs restricted to management
CREATE POLICY "Audit logs for admin only" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
