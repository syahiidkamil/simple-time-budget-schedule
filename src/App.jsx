import { createBrowserRouter, RouterProvider } from "react-router";
import { SonnerProvider } from "./shared/components/ui/sonner-provider";
import ProtectedRoute from "./shared/routes/ProtectedRoute";
import PublicRoute from "./shared/routes/PublicRoute";

import DashboardLayout from "./features/dashboard/DashboardLayout";
import { AuthProvider } from "./features/auth/contexts/AuthProvider";

// Import pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import NotFoundPage from "./features/not-found/NotFoundPage";
import DashboardHomePage from "./features/dashboard-home/DashboardHomePage";
import ProfilePage from "./features/profile/ProfilePage";

// Route configuration array
const routesConfig = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardHomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      }
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

// Initialize router only on client side
const App = () => {
  // We need to check if we're in a browser environment before creating the router
  if (typeof window === "undefined") {
    return null;
  }

  // Create browser router without a basename
  // This will make it work directly from the root URL
  const router = createBrowserRouter(routesConfig);

  return (
    <AuthProvider>
      <SonnerProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;