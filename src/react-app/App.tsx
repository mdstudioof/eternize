import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import AuthCallback from "@/react-app/pages/AuthCallback";
import Checkout from "@/react-app/pages/Checkout";
import Success from "@/react-app/pages/Success";
import MemorialView from "@/react-app/pages/MemorialView";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/memorial/:qrCodeId" element={<MemorialView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
