import { SearchBar } from "../base/SearchBar";

export default function SearchSection({
  searchParam,
}: {
  searchParam?: string;
}) {
  return (
    <section id="section" className="bg-darkBlue">
      {/* Flex Container */}
      <div className="container  flex flex-col items-stretch justify-around py-12 gap-x-8 space-y-12 md:py-12 md:flex-row md:space-y-0 md:items-center">
        {/* Heading */}
        <h2 className="text-5xl font-bold leading-tight text-aligned text-white md:text-4xl md:max-w-xl md:text-left">
          Learn something new today
        </h2>
        {/* Button */}
        <SearchBar
          className="flex flex-grow flex-wrap justify-center items-end gap-4 text-white"
          label="Find books, research papers, ..."
        />
      </div>
    </section>
  );
}
