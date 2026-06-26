-- Seed data for Koi Travel CRM

-- We can't easily seed auth.users directly without the Supabase Admin API in raw SQL usually, 
-- but in local dev, we can insert into auth.users. 
-- For simplicity, we'll insert into public.users assuming auth.users are handled by the app later or we use dummy UUIDs for testing.

-- Let's use some fixed UUIDs for test roles
-- Admin: 00000000-0000-0000-0000-000000000001
-- Sales: 00000000-0000-0000-0000-000000000002
-- Accounting: 00000000-0000-0000-0000-000000000003
-- Operations: 00000000-0000-0000-0000-000000000004

-- Insert to auth.users (local dev only)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@koitravel.com', 'dummy_hash', NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'sales@koitravel.com', 'dummy_hash', NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'accounting@koitravel.com', 'dummy_hash', NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'ops@koitravel.com', 'dummy_hash', NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW(), '', '', '', '');


INSERT INTO public.users (id, first_name, last_name, email, role, department)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'User', 'admin@koitravel.com', 'admin', 'Management'),
  ('00000000-0000-0000-0000-000000000002', 'Sales', 'Rep', 'sales@koitravel.com', 'sales_marketing', 'Sales'),
  ('00000000-0000-0000-0000-000000000003', 'Accountant', 'Jane', 'accounting@koitravel.com', 'accounting', 'Accounting'),
  ('00000000-0000-0000-0000-000000000004', 'Ops', 'Manager', 'ops@koitravel.com', 'operations', 'Operations');

-- Sample Clients
INSERT INTO public.clients (id, first_name, last_name, client_type, assigned_consultant_id, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'leisure', '00000000-0000-0000-0000-000000000002', 'john@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Acme', 'Corp', 'corporate', '00000000-0000-0000-0000-000000000002', 'info@acme.com');

-- Sample Suppliers
INSERT INTO public.suppliers (id, name, category, status, payment_terms)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Safari Lodge Kenya', 'luxury', 'active', 'Net 30'),
  ('44444444-4444-4444-4444-444444444444', 'Nairobi Transport Services', 'budget', 'pending_approval', 'Net 15');
