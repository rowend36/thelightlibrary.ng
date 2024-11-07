import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { DashboardProvider } from "../../components/admin/DashboardContext";
import Loader from "../../components/Loader";
import { mapResponseToPurchases } from "../../data/actions/mappers";
import { authQueryFn } from "../../data/actions/queryFn";
import { Purchase } from "../../data/models/purchase";
export default function AdminPurchasesPage(): JSX.Element {
  const {
    data: purchases,
    // isLoading,
    refetch,
  } = useQuery({
    queryKey: ["purchases"],
    queryFn: authQueryFn,
    select: mapResponseToPurchases,
  });

  return (
    <>
      <DashboardProvider value={purchases}>
        {/* <ButtonBase
          className="mb-8 block mx-auto w-max"
          as={Link}
          to="/admin/purchases/new"
        >
          Add New Purchase
        </ButtonBase> */}

        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">All Purchases</h2>

            <PurchasesTable purchases={purchases} />
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}

function PurchasesTable({ purchases }: { purchases: Purchase[] | undefined }) {
  const queryClient = useQueryClient();
  return (
    <DataTable
      className="w-full"
      data={purchases!}
      keyField="user_id"
      columns={[
        {
          name: "ID",
          selector(e: Purchase) {
            return e.cart_id;
          },
          minWidth: "auto",
          grow: 0,
        },

        {
          name: "Price",
          selector(e: Purchase) {
            return e.purchase_price;
          },
        },
        {
          name: "Status",
          selector(e: Purchase) {
            return e.status;
          },
        },
        {
          name: "Completion Time",
          grow: 2,
          selector(e: Purchase) {
            return e.completed_at ?? "--";
          },
        },
        {
          name: "No. of Books",
          grow: 0,
          minWidth: "10em",
          selector(e: Purchase) {
            return e.cart?.books.length;
          },
        },
        {
          name: "Books",
          grow: 2,
          selector(e: Purchase) {
            return e.cart?.books.map((e) => e.title).join(", ");
          },
        },
      ]}
      progressPending={!purchases}
      progressComponent={<Loader className="pt-14" />}
    />
  );
}
