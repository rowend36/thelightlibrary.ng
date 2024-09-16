import { ActionResponse } from "../data/actions/ActionResponse";

export default function errorDescription(
  state: ActionResponse,
  ...path: (string | number)[]
) {
  if (state?.errors) {
    const errors = state.errors.filter(
      (e) =>
        e.path &&
        e.path.length === path.length &&
        e.path.every((o, i) => o === path[i])
    );
    if (errors.length) {
      return errors.map((e) => e.message).join("\n");
    }
  }
  return false;
}
