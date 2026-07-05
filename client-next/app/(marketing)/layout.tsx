import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/providers/auth-provider";
import { UserProvider } from "@/providers/user-provider";
import { SiteChrome } from "@/components/layout/site-chrome";

// Shared chrome for every route in the app. Extended in Phase 3 to add
// UserProvider (previously only AuthProvider existed, per the approved
// Phase 1 minimal-stub decision) and to replace unconditional Navbar/Footer
// rendering with <SiteChrome>, which reproduces App.jsx's original
// pathname-based hideNavbar/hideFooter/hideFloat logic — now required
// because this phase adds routes (Login, Signup, Test, Score Checker) that
// the original hid chrome for. No Phase 1/2 page files are touched by this
// change.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <SiteChrome>{children}</SiteChrome>
      </UserProvider>
    </AuthProvider>
  );
}
