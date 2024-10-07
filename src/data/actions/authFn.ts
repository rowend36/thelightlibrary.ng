import { fetcher } from "./queryFn";

export async function loginFn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return fetcher("auth/login", {
    data: {
      email,
      password,
    },
  });
}
