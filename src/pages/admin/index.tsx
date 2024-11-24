import { useQuery } from "@tanstack/react-query";
import bookPng from "../../assets/my_images/image.png";
import { DashboardProvider } from "../../components/admin/DashboardContext";
import { queryFn } from "../../data/actions/queryFn";

export default function AdminPage(): JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "/dashboard"],
    queryFn,
  });
  return (
    <>
      <DashboardProvider value={data}>
        {" "}
        <div className="flex flex-wrap gap-x-4 justify-between mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56">
            <div className="text-sm text-gray-400 mb-1">Books</div>
            <div className="text-3xl">15</div>
          </div>
          <div className="shadow-sm bg-white p-4 rounded-md basis-56">
            <div className="text-sm text-gray-400 mb-1">Reviews</div>
            <div className="text-3xl">15</div>
          </div>
          <div className="shadow-sm bg-white p-4 rounded-md basis-56">
            <div className="text-sm text-gray-400 mb-1">Revenue</div>
            <div className="text-3xl">N150,000</div>
          </div>
          <div className="shadow-sm bg-white p-4 rounded-md basis-56">
            <div className="text-sm text-gray-400 mb-1">Visitors</div>
            <div className="text-3xl">150</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-96 max-w-full flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">Top Selling</h2>
            <table className="w-full">
              <thead>
                <tr className="text-lg font-bold text-gray-600">
                  <td>Image</td>
                  <td className="border-x px-4">Book Title</td>
                  <td className="px-4">Downloads</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-lg">
                  <td>
                    <img src={bookPng} className="w-16" />
                  </td>
                  <td className="border-x px-4">
                    <div>The Prodigal Son</div>
                  </td>
                  <td className="px-4">
                    <div>512</div>
                  </td>
                </tr>
                <tr className="text-lg">
                  <td>
                    <img src={bookPng} className="w-16 py-8" />
                  </td>
                  <td className="border-x px-4">
                    <div>The Prodigal Son</div>
                  </td>
                  <td className="px-4">
                    <div>512</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="shadow-sm bg-white p-4 rounded-md basis-96 max-w-full flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">Recent Reviews</h2>
            <div className="pl-4 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, est? Hic quis asperiores fugiat neque laboriosam odio
              cupiditate magni laborum, maxime sit beatae est quisquam earum
              similique praesentium doloremque minima.
              <div className="flex flex-col items-end">
                <span>
                  by
                  <b> Unknown User</b>
                </span>
                <i>5 minutes ago</i>
              </div>
            </div>
            <div className="border-b my-4" />
            <div className="pl-4 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, est? Hic quis asperiores fugiat neque laboriosam odio
              cupiditate magni laborum, maxime sit beatae est quisquam earum
              similique praesentium doloremque minima.
              <div className="flex flex-col items-end">
                <span>
                  by
                  <b> Unknown User</b>
                </span>
                <i>5 minutes ago</i>
              </div>
            </div>
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}
