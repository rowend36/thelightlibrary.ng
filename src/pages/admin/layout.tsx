import { Outlet, useMatch, useMatches, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { useAuth } from "../../data/services/user_manager";

export default function AdminLayout() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (useMatches().pop()?.handle as any)?.meta;
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth.user === undefined) return;
    if (!auth.user) {
      navigate("/login");
    }
  }, [navigate, auth.user]);

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={<Header title={meta?.title} />}
      mainLoader={
        <div className="text-lg text-center my-16">
          <Loader />
          <span className="text-sm text-gray-700">
            Loading. Please wait ...
          </span>
        </div>
      }
      main={auth.user ? <Outlet /> : <Loader className="h-60" />}
    />
  );
}
