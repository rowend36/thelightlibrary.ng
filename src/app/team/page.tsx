import Navbar from "@/components/about/Navbar";
import Footer from "@/components/about/Footer";
import Image from "next/image";
import anisha from "../../assets/images/website-design.webp";
import { Button } from "@headlessui/react";
import { ButtonBase } from "@/components/base/ButtonBase";
import Link from "@/components/base/Link";
import { Link1 as LinkIcon } from "iconsax-react";
import paul from "../../assets/images/paul.jpg";
export default function Home() {
  const teamMembers = [
    {
      id: 1,
      name: "Amupitan Olasunkanmi Paul",
      role: "Team Lead",
      image: paul.src,
      description: `I'm a graduate of Business Administration from the prestigious University of Ilorin, Kwara State Nigeria and also a National Youth Corps member with state code AB/23C/2696, serving in Abia State Nigeria, specifically at the Abia State Government House.

I'm a young leader devoted to making impacts and contributing to the development of whatever and wherever I find myself.

Hence, my team and I have given ourselves to executing several Community Development Service Projects withing the City of Umuahia, the Capital city of Abia State. From developing technologies to aid operations in the State's Civil Service, to the outreaches to school children and then to this particular E-Library project which we have developed to serve primarily as a repository for all publications of the NYSC Abia State and to also provide educational materials to avid readers and Academics.

We believe this initiative will serve you and contribute to your wholistic development. Thank you.

Please reach me on Whataspp via +2347026207147
`,
      linkText: "View on LinkedIn",
      link: "https://www.linkedin.com/in/paul-amupitan-368aa2190?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      id: 1,
      name: "Owologba Oro",
      role: "Software Engineer",
      image: anisha.src,
      description: `Creative software developer dedicated to designing innovative user experiences.
      Volunteer at the NYSC Abia Library Project.`,
      linkText: "View Profile",
      link: "https://reelest.com.ng",
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
                className="flex even:flex-row-reverse gap-x-32 gap-y-8 flex-wrap justify-center mt-32 items-start"
                key={member.id}
              >
                <Image
                  src={member.image}
                  width={480}
                  height={480}
                  alt={"image for " + member.name}
                  className="max-w-full w-[480px] aspect-square object-cover object-top  rounded-full border border-darkBlue/25"
                />
                <div className="flex flex-col w-[480px] max-w-full py-2">
                  <h2 className="text-2xl">{member.name}</h2>
                  <h3 className="text-lg text-darkGrayishBlue -order-1">
                    {member.role}
                  </h3>
                  <p className="mt-8 text-darkGrayishBlue whitespace-pre-line">
                    {member.description}
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
