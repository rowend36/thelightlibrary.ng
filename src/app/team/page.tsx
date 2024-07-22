import Navbar from "@/components/about/Navbar";
import Footer from "@/components/about/Footer";
import Image from "next/image";
import anisha from "../../assets/images/avatar-anisha.png";
import { Button } from "@headlessui/react";
import { ButtonBase } from "@/components/base/ButtonBase";
import Link from "@/components/base/Link";
import { Link1 as LinkIcon } from "iconsax-react";
export default function Home() {
  const teamMembers = [
    {
      id: 1,
      name: "NYSC Abia State",
      role: "Sponsor",
      image: anisha.src,
      linkText: "Visit Website",
      link: "https://nysc.abiastate.gov.ng",
    },
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      image: anisha.src,
      linkText: "View Profile",
      link: "https://github.com/rowend36",
    },
  ];
  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="text-primary text-center text-3xl capitalize mt-16">
          The Team
        </h1>
        <p className="text-center text-darkBlue mt-4">
          Meet the people that made this possible.
        </p>
        <div className="mb-32">
          {teamMembers.map((member) => {
            return (
              <div
                className="flex even:flex-row-reverse gap-x-32 gap-y-8 flex-wrap justify-center mt-32"
                key={member.id}
              >
                <Image
                  src={member.image}
                  width={360}
                  height={360}
                  alt={"image for " + member.name}
                  className="max-w-full w-96 aspect-square rounded-full border border-darkBlue/25"
                />
                <div className="flex flex-col w-96 max-w-full py-2">
                  <h2 className="text-2xl">{member.name}</h2>
                  <h3 className="text-lg text-darkGrayishBlue -order-1">
                    {member.role}
                  </h3>
                  <p className="mt-8 text-darkGrayishBlue">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Mollitia recusandae molestiae unde adipisci! Architecto, ad
                    voluptatibus. Iusto labore reprehenderit, similique nulla ab
                    inventore temporibus ad, eaque dignissimos incidunt,
                    perspiciatis eius!
                  </p>
                  <div className="flex-grow" />
                  <ButtonBase
                    className="text-primary mt-12 text-center flex items-center justify-center gap-2"
                    as="a"
                    href={member.link}
                    target="_blank"
                  >
                    {member.linkText}
                    <LinkIcon color="white" size={20} />
                  </ButtonBase>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
