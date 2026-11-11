import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  Home,
  Services,
  ProviderDetail,
  DemoAccess,
  About,
  Contact,
  NotFound,
} from "./pages/Public";
import Request from "./pages/Request";
import {
  Overview,
  Requests,
  RequestDetail,
  Favorites,
} from "./pages/Dashboard";
import { MyServices, Categories, Providers, Profile } from "./pages/Manage";
export default function App() {
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="providers/:id" element={<ProviderDetail />} />
          <Route path="request/:id" element={<Request />} />
          <Route path="account" element={<DemoAccess />} />
          <Route path="demo-access" element={<DemoAccess />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="dashboard" element={<Overview />} />
          <Route path="dashboard/requests" element={<Requests />} />
          <Route path="dashboard/requests/:id" element={<RequestDetail />} />
          <Route path="dashboard/favorites" element={<Favorites />} />
          <Route path="dashboard/services" element={<MyServices />} />
          <Route path="dashboard/categories" element={<Categories />} />
          <Route path="dashboard/providers" element={<Providers />} />
          <Route path="dashboard/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
