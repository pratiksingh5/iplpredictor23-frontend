import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { SuspenseLoader } from "@/components";
import ProtectedRoute from "./protectedRoute";

const LeaderboardPage = SuspenseLoader(
  lazy(() => import("../pages/Leaderboard"))
);
const PredictWinPage = SuspenseLoader(
  lazy(() => import("../pages/PredictWin"))
);
const MatchHistoryPage = SuspenseLoader(
  lazy(() => import("../pages/MatchHistory"))
);
const NotFoundPage = SuspenseLoader(lazy(() => import("../pages/NotFound")));
const LoginPage = SuspenseLoader(lazy(() => import("../pages/LoginPage")));
const SignupPage = SuspenseLoader(lazy(() => import("../pages/SignupPage")));
const ForgetPassword = SuspenseLoader(
  lazy(() => import("../pages/ForgetPassword"))
);
const AdminPanel = SuspenseLoader(lazy(() => import("../pages/AdminPanel")));
const Profile = SuspenseLoader(lazy(() => import("../pages/Profile")));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <LeaderboardPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <SignupPage /> },
      { path: "/forget-password", element: <ForgetPassword /> },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminPanel />
           </ProtectedRoute>
        ),
      },
      {
        path: "/predict",
        element: (
          <ProtectedRoute>
            <PredictWinPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "match-history",
        element: <MatchHistoryPage />,
      },

      {
        path: "profile/:id",
        element: <MatchHistoryPage />,
      },
    ],
  },
]);

export default router;
