import {
  DashboardProps,
  DashboardProvider,
} from "@/components/admin/DashboardContext";
import DashboardLayout from "@/components/admin/DashboardLayout";
import Header from "@/components/admin/Header";
import Main from "@/components/admin/Main";
import Sidebar from "@/components/admin/Sidebar";
import { getBookCount } from "@/services/book_service";
import { getUser } from "@/utils/get_user";
import { useMemo } from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  const props = useMemo(
    async (): Promise<DashboardProps> => ({
      user: await user,
      numBooks: await getBookCount(),
    }),
    [user]
  );
  return (
    <DashboardLayout
      main={<Main props={props}>{children}</Main>}
      sidebar={<Sidebar />}
      header={<Header user={user as any} />}
    />
  );
}
