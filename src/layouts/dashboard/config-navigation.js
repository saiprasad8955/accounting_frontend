import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {

  
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Accounting & Billing',
        items: [
          { title: 'Sales', path: paths.dashboard.root, icon: ICONS.dashboard },
          {
            title: 'Purchase',
            path: paths.dashboard.purchase.root,
            icon: ICONS.analytics,
            children: [
              { title: 'Purchase Order', path: paths.dashboard.purchase.order },
              { title: 'Purchase Return Order', path: paths.dashboard.purchase.returnOrder },
            ]

          },
          { title: 'Payments', path: paths.dashboard.payments, icon: ICONS.ecommerce },
          { title: 'Receipts', path: paths.dashboard.receipts, icon: ICONS.ecommerce },
          { title: 'Expenditure', path: paths.dashboard.expenditure, icon: ICONS.ecommerce },
          {
            title: 'Product Master',
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              { title: 'Products', path: paths.dashboard.product.list },
              { title: 'Bar Codes', path: paths.dashboard.product.barcode },
            ]
          },
          { title: 'Vendor Master', path: paths.dashboard.vendor, icon: ICONS.ecommerce },
          { title: 'Customer Master', path: paths.dashboard.customer, icon: ICONS.ecommerce },
          { title: 'User Management', path: paths.dashboard.user, icon: ICONS.user },
          { title: 'Offer Management', path: paths.dashboard.offer, icon: ICONS.ecommerce },
        ],
      },
    ],
    []
  );

  return data;
}
