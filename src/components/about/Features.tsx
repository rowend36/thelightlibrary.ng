import React, { ReactNode } from "react";
import Image from "next/image";
import booksImage from "@/assets/images/books.jpg";

const Features = () => {
  return (
    <section id="features">
      {/* Flex Container */}
      <div className="container flex flex-col mt-10 space-y-12 md:space-y-0 md:flex-row md:space-x-8">
        {/* What's Different */}
        <div className="flex flex-col space-y-12 md:w-1/2 items-aligned">
          <h2 className="max-w-md text-4xl font-bold text-aligned items-start">
            What's different about NYSC Abia Library?
          </h2>
          <p className="max-w-sm text-text text-aligned">
            NYSC Abia Library provides all the functionality you need for
            research, without the complexity. Our software is tailor-made for
            every kind of user.
          </p>
          <div className="w-full max-md:max-w-sm rounded-sm md:relative md:w-[calc(100%+2rem)] lg:w-[calc(100%+6rem)] md:self-end max-w-none flex-grow">
            <Image
              src={booksImage}
              alt="Books"
              className="object-cover max-w-2xl w-full"
            />
          </div>
        </div>

        {/* Numbered List */}
        <div className="flex flex-col space-y-8 md:w-1/2">
          <ListItem index={1} title="Interactive Reading Experience">
            Immerse yourself in a truly interactive reading experience.
            Highlight and annotate text, bookmark pages, and add personal notes
            to enhance your understanding and retention. Our intuitive interface
            makes it easy to engage with the content and customize your reading
            experience to suit your preferences.
          </ListItem>
          <ListItem index={2} title="Advanced built-in reports">
            Set internal delivery estimates and track progress toward company
            goals. Our customisable dashboard helps you build out the reports
            you need to keep key stakeholders informed.
          </ListItem>
          <ListItem index={3} title="Everything you need in one place">
            Stop jumping from one service to another to communicate, store
            files, track tasks and share documents. NYSC Abia Library offers an
            all-in-one research solution.
          </ListItem>
        </div>
      </div>
    </section>
  );
};

function ListItem({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">
      {/* Heading */}
      <div className="rounded-l-full bg-gradient-to-r from-primaryLight to-transparent md:bg-none">
        <div className="flex items-center space-x-2">
          <div className=" px-4 py-2 text-white rounded-full md:py-1 bg-primary flex items-center">
            {index.toString().padStart(2, "0")}
          </div>
          <h3 className="text-base font-bold md:mb-4 md:hidden">{title}</h3>
        </div>
      </div>

      <div>
        <h3 className="hidden mb-4 text-lg font-bold md:block">{title}</h3>
        <p className="text-text">{children}</p>
      </div>
    </div>
  );
}

export default Features;
