import { CloseCircle, Menu } from "iconsax-react";
import { ReactElement, ReactNode, Suspense } from "react";
import { AppLogo } from "../AppLogo";
import Empty from "../Empty";

export default function DashboardLayout({
  main,
  sidebar,
  header = <Empty />,
  footer = <Empty />,
  sidebarLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
  headerLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
  mainLoader = (
    <div className="text-darkGrayishBlue text-center">
      <i>Loading...</i>
    </div>
  ),
}: Partial<
  Record<"sidebarLoader" | "headerLoader" | "mainLoader", ReactNode> &
    Record<"sidebar" | "header" | "main" | "footer", ReactElement>
>) {
  return (
    <div className="flex md:h-screen max-md:min-h-screen min-h-80">
      <input type={"checkbox"} id={"menu-toggle"} className="hidden peer" />
      <label
        htmlFor="menu-toggle"
        className="inset-0 bg-black/50 fixed z-10 invisible peer-0checked:visible"
      />
      <label
        htmlFor="menu-toggle"
        className="py-3 px-3 md:hidden fixed top-1 z-30 cursor-pointer peer-checked:translate-x-48 transition-transform peer-checked:invisible"
      >
        <i className="text-lg p-1 text-text bx-menu bx" />
      </label>
      <label
        htmlFor="menu-toggle"
        className="py-3 px-3 md:hidden fixed top-0 z-30 cursor-pointer peer-checked:translate-x-48 transition-transform invisible peer-checked:visible"
      >
        <CloseCircle className="w-7 h-7 p-1 text-text" />
      </label>
      <div className="flex flex-shrink-0 flex-col w-64 px-4 xl:px-8 max-md:fixed bg-white border-gray-300 border-r max-md:shadow-lg max-md:hidden max-md:peer-checked:flex max-md:z-10 max-md:h-full max-h-screen overflow-auto">
        <AppLogo className="h-16 max-w-full" />
        {/* <Suspense fallback={sidebarLoader}> */}
        {sidebar}
        {/* </Suspense> */}
      </div>
      <div className="flex flex-col flex-grow min-w-0">
        <div className="h-16 md:h-20 flex items-center rounded-b-sm  border-b bg-gray-100 max-md:fixed max-md:w-full max-md:shadow-md max-md:bg-white">
          {/* <Suspense fallback={headerLoader}> */}
          {header}
          {/* </Suspense> */}
        </div>
        <div className="flex-grow h-0 py-8 px-4 xl:px-8 max-md:mt-14  bg-gray-100 container overflow-auto ">
          <div
            className="max-h-full -mr-4 pr-4"
            style={{
              "--background-rgb": "243 244 246",
            }}
          >
            {/* <Suspense fallback={mainLoader}> */}
            {main}
            {/* </Suspense> */}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
