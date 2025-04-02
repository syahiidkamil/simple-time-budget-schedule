import { createBrowserRouter, RouterProvider } from "react-router";
import { SonnerProvider } from "./shared/components/ui/sonner-provider";
import ProtectedRoute from "./shared/routes/ProtectedRoute";
import PublicRoute from "./shared/routes/PublicRoute";

import DashboardLayout from "./features/dashboard/DashboardLayout";
import { AuthProvider } from "./features/auth/contexts/AuthProvider";
import { TimeBudgetProvider } from "./features/time-budget/contexts/TimeBudgetContext";

// Import pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import NotFoundPage from "./features/not-found/NotFoundPage";
import DashboardHomePage from "./features/dashboard-home/DashboardHomePage";
import TimeBudgetPage from "./features/time-budget/TimeBudgetPage";
import SchedulePage from "./features/schedule/SchedulePage";

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
        path: "time-budget",
        element: <TimeBudgetPage />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
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
      <TimeBudgetProvider>
        <SonnerProvider />
        <RouterProvider router={router} />
      </TimeBudgetProvider>
    </AuthProvider>
  );
};

export default App;