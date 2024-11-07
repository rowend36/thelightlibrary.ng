import { useQueryClient } from "@tanstack/react-query";
import { Edit, Edit2, Eye, Icon, Trash } from "iconsax-react";
import { Link } from "react-router-dom";
import { fetcher } from "../../data/actions/queryFn";

function Action(props: {
  action: string | null | (() => void);
  label: string;
  icon: Icon;
  className: string;
}) {
  const Icon = props.icon;
  if (!props.action) return null;
  const Container = typeof props.action === "string" ? Link : "button";
  return (
    <Container
      to=""
      className={"p-2 rounded-md text-sm " + props.className}
      {...{
        [Container === Link ? "to" : "onClick"]: props.action,
      }}
    >
      <Icon className="inline mr-2 mb-1" size={16} />
      {props.label}
    </Container>
  );
}
export function EditOpenDeletePanel(props: {
  onEdit?: string | null | (() => void);
  onDelete?: string | null | (() => void);
  onOpen?: string | null | (() => void);
  refreshRoute?: string[];
}) {
  const queryClient = useQueryClient();
  return (
    <div className="flex h-full items-center gap-2">
      {props.onOpen ? (
        <Action
          label="View"
          icon={Eye}
          className="text-green-900 hover:bg-green-200 active:bg-green-300"
          action={props.onOpen ?? null}
        />
      ) : null}
      {props.onEdit ? (
        <Action
          label="Modify"
          icon={Edit2}
          className="text-primary hover:bg-primaryHover/20 active:bg-primaryHover"
          action={props.onEdit ?? null}
        />
      ) : null}
      {props.onDelete ? (
        <Action
          label="Delete"
          icon={Trash}
          className="text-red-700 hover:bg-red-100 active:bg-red-200"
          action={
            typeof props.onDelete === "string"
              ? async () => {
                  const res = confirm("Delete this item?");
                  if (res) {
                    await fetcher(props.onDelete as string, {
                      method: "DELETE",
                    });
                    if (props.refreshRoute)
                      await queryClient.refetchQueries({
                        queryKey: props.refreshRoute,
                      });
                  }
                }
              : props.onDelete ?? null
          }
        />
      ) : null}
    </div>
  );
}
