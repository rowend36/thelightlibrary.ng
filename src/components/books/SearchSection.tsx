import { SearchBar } from "../base/SearchBar";

export default function SearchSection({
  searchParam,
}: {
  searchParam?: string;
}) {
  return (
    <section id="section" className="bg-gray-900 pt-24 max-sm:pt-18 md:pt-18">
      {/* Flex Container */}
      <div className="container  flex flex-col items-stretch justify-around py-12 gap-x-8 space-y-12 md:py-12 md:flex-row md:space-y-0 md:items-center">
        {/* Button */}
        <SearchBar
          className="flex flex-grow flex-wrap justify-center items-end gap-4 text-white"
          label="Search across all of our books ..."
          defaultValue={searchParam}
        />
      </div>
    </section>
  );
}
