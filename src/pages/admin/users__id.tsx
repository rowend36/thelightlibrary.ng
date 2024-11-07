import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save2 } from "iconsax-react";
import { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { ButtonBase } from "../../components/base/ButtonBase";
import InputBase from "../../components/base/InputBase";
import { authQueryFn, fetcher } from "../../data/actions/queryFn";
import { User } from "../../data/models/user";
import { mapResponseToUser } from "../../data/actions/mappers";
import { Select } from "@headlessui/react";
export default function AdminEditUserPage() {
  const params = useParams();
  const { data: user } = useQuery({
    queryKey: ["users/", params.id!],
    queryFn: authQueryFn,
    select: mapResponseToUser,
  });
  return <UserForm user={user} />;
}

export function UserForm({ user }: { user?: User }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("member");
  const queryClient = useQueryClient();
  useEffect(() => {
    setEmail(user?.email ?? "");
    setUsername(user?.username ?? "");
    setRole(user?.role ?? "member");
  }, [user]);

  return (
    <Form>
      <InputBase
        name="email"
        className="mb-8"
        label="User's Email"
        disabled
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputBase
        name="username"
        className="mb-8"
        disabled
        label="User's Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <InputBase
        name="role"
        className="mb-8"
        label="User's Role in the system"
        value={role}
        as={Select}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="member">Ordinary Member</option>
        <option value="admin">Admin Member</option>
      </InputBase>

      <ButtonBase
        className="mt-8 flex gap-2 "
        onClick={async () => {
          if (user) {
            // update user
            fetcher("users/" + user.user_id + "/role", {
              method: "POST",
              data: {
                role,
              },
            }).then(() => {
              queryClient.invalidateQueries({
                queryKey: ["users/"],
              });
            });
          }
        }}
      >
        <Save2 className="mb-1" />
        <span>Update User</span>
      </ButtonBase>
      <div className="h-16" />
    </Form>
  );
}
