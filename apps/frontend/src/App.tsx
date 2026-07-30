import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "./pages/Login"
import DashboardLayout from "./layout/DashboardLayout";
import ImageGallery from "./pages/ImageGallery";
import GenerateImages from "./pages/GenerateImages";
import CreditsTransaction from "./pages/TransactionHistory";
import Credits from "./pages/CreditsPage";
import LandingPage from "./pages/LandingPage";
import Setting from "./pages/Setting";
import SignUp from "./pages/SignUp";
import Pricing from "./components/Pricing";
import { CreditsProvider } from "./context/CreditsContext";
import ProtectedRoute from "./layout/ProtectedRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <CreditsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<GenerateImages />} />
              <Route path="billing" element={<Pricing variant="dashboard" />} />
              <Route path="generate-image" element={<GenerateImages />} />
              <Route path="images" element={<ImageGallery />} />
              <Route path="credits" element={<Credits />} />
              <Route path="transactions" element={<CreditsTransaction />} />
              <Route path="setting" element={<Setting />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CreditsProvider>
  );
}



export default App
