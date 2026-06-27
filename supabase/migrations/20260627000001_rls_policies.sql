-- Advanced RLS Policies for Koi Travel CRM

-- 1. Invoices / Financial Totals: Operations should not see amounts.
-- Since RLS applies to rows, not columns easily, we might use views or functions.
-- For now, restrict delete operations to Admin.

CREATE POLICY "Admin delete only" ON public.clients FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin delete only" ON public.trips FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Invoices: Accounts, Admin, Sales can read. Operations read limited to certain parts.
CREATE POLICY "Invoice read access" ON public.invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'accounting', 'sales_marketing'))
);

-- Management financial totals function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.management_financial_totals()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role user_role;
  total_revenue NUMERIC;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Access Denied: Management only';
  END IF;

  SELECT SUM(amount) INTO total_revenue FROM public.payments WHERE entity_type = 'invoice';
  
  RETURN json_build_object('total_revenue', COALESCE(total_revenue, 0));
END;
$$;
