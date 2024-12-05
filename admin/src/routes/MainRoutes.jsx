import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';  // Import the new ProtectedRoute

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />,  
  children: [
    {
      element: <Dashboard />,  // Dashboard layout
      children: [
        {
          index: true,  // This will be the default route after login
          element: <DashboardDefault />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: '/free',
          element: <AuthLogin/>  
        },
        {
          path: 'dashboard/default',
          element: <DashboardDefault />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'shadow',
          element: <Shadow />
        },
        {
          path: 'typography',
          element: <Typography />
        }
      ]
    }
  ]
};

export default MainRoutes;


