import { useQuery } from "@tanstack/react-query";
import { DashboardProvider } from "../../components/admin/DashboardContext";
import { DataView } from "../../components/admin/DataView";
import { EditOpenDeletePanel } from "../../components/admin/EditOpenDeletePanel";
import { mapResponseToUsers } from "../../data/actions/mappers";
import { authQueryFn } from "../../data/actions/queryFn";
import { User } from "../../data/models/user";
export default function AdminUsersPage(): JSX.Element {
  const {
    data: users,
    // isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: authQueryFn,
    select: mapResponseToUsers,
  });

  return (
    <>
      <DashboardProvider value={users}>
        {/* <ButtonBase
          className="mb-8 block mx-auto w-max"
          as={Link}
          to="/admin/users/new"
        >
          Add New User
        </ButtonBase> */}

        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">All Users</h2>

            <UsersTable users={users} />
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}

function UsersTable({ users }: { users: User[] | undefined }) {
  return (
    <DataView
      data={users}
      specs={{
        user_id: {
          label: "ID",
        },
        email: {
          label: "Email",
        },
        username: {
          label: "Name",
        },
        role: {
          label: "Role",
        },
      }}
      wide={["username", "email"]}
      actionsWidth={120}
      actions={(e) => (
        <EditOpenDeletePanel onEdit={"/admin/users/" + e.user_id} />
      )}
    />
  );
}
