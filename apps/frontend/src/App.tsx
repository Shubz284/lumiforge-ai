import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import DashboardLayout from "./layout/DashboardLayout";
import ImageGallery from "./pages/ImageGallery";
import GenerateImages from "./pages/GenerateImages";
import CreditsTransaction from "./pages/CreditsTransaction";
import Credits from "./pages/Credits";
import Setting from "./pages/Setting";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="generate-image" element={<GenerateImages />} />
          <Route path="images" element={<ImageGallery />} />
          <Route path="transactions" element={<CreditsTransaction />} />
          <Route path="credits" element={<Credits />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App
