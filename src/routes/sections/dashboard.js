import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const SalesPage = lazy(() => import('src/pages/dashboard/one'));
const PayementsPage = lazy(() => import('src/pages/dashboard/two'));
const ReceiptsPage = lazy(() => import('src/pages/dashboard/three'));
const ExpenditurePage = lazy(() => import('src/pages/dashboard/four'));
const PurchaseOrderPage = lazy(() => import('src/pages/dashboard/five'));
const PurcahseReturnOrderPage = lazy(() => import('src/pages/dashboard/six'));
const ProductPage = lazy(() => import('src/pages/dashboard/product/order'));
const ProductBarcodePage = lazy(() => import('src/pages/dashboard/product/barcode'));
const VendorPage = lazy(() => import('src/pages/dashboard/vendorPage'));
const CustomerPage = lazy(() => import('src/pages/dashboard/customerPage'));
const UserPage = lazy(() => import('src/pages/dashboard/userPage'));
const OffersPage = lazy(() => import('src/pages/dashboard/offersPage'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <SalesPage />, index: true },
      {
        path: 'purchase',
        children: [
          { path: 'order', element: <PurchaseOrderPage /> },
          { path: 'returnOrder', element: <PurcahseReturnOrderPage /> },
        ],
      },
      { path: 'payments', element: <PayementsPage /> },
      { path: 'receipts', element: <ReceiptsPage /> },
      { path: 'expenditure', element: <ExpenditurePage /> },
      {
        path: 'product',
        children: [
          { path: 'list', element: <ProductPage /> },
          { path: 'barcode', element: <ProductBarcodePage /> },
        ],
      },
      { path: 'vendor', element: <VendorPage /> },
      { path: 'customer', element: <CustomerPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'offer', element: <OffersPage /> },
    ],
  },
];
