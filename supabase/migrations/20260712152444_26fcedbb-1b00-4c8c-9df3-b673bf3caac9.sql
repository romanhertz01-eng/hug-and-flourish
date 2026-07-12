
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS logo_domain text,
  ADD COLUMN IF NOT EXISTS logo_url text;

UPDATE public.cards SET logo_domain = 'platipomiru.com'      WHERE slug = 'plati-po-miru';
UPDATE public.cards SET logo_domain = 'wanttopay.net'        WHERE slug = 'wanttopay';
UPDATE public.cards SET logo_domain = 'wayment.net'          WHERE slug = 'wayment';
UPDATE public.cards SET logo_domain = 'golden-card.ru'       WHERE slug = 'aifory-pro';
UPDATE public.cards SET logo_domain = 't.me'                 WHERE slug = 'flowbit-finance';
UPDATE public.cards SET logo_domain = 't.me'                 WHERE slug = 'zarub';
UPDATE public.cards SET logo_domain = 'o-plata.ru'           WHERE slug = 'o-plata';
UPDATE public.cards SET logo_domain = 'migpay.app'           WHERE slug = 'mig-pay';
UPDATE public.cards SET logo_domain = 'portal.chocopay.io'   WHERE slug = 'chocopay';
UPDATE public.cards SET logo_domain = 'easypayments.online'  WHERE slug = 'easy-payments';
UPDATE public.cards SET logo_domain = 'app.terbium-wallet.com' WHERE slug = 'terbium-wallet';
UPDATE public.cards SET logo_domain = 'card.club'            WHERE slug = 'cardclub';
UPDATE public.cards SET logo_domain = 'morekart.ru'          WHERE slug = 'morekart';
UPDATE public.cards SET logo_domain = 'e.pn'                 WHERE slug = 'e-pn';
UPDATE public.cards SET logo_domain = 'heleket.com'          WHERE slug = 'heleket';
