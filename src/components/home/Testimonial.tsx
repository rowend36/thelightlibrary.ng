import { Link } from "react-router-dom";

// import avatarAnisha from "../assets/images/avatar-anisha.png";
// import avatarAli from "../assets/images/avatar-ali.png";
// import avatarRichard from "../assets/images/avatar-richard.png";
import { ButtonBase } from "../base/ButtonBase";

const Testimonial = () => {
  return (
    <section id="testimonials">
      {/* Container to heading and testm blocks */}
      <div className="container mt-32 text-aligned lg:text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-aligned lg:text-center">
          What&apos;s Different About NYSC Abia Library?
        </h2>
        {/* Testimonials Container */}
        <div className="flex flex-col mt-12 md:flex-row md:space-x-6">
          {/* Testimonial 1 */}
          <div className="flex flex-col mb-8 max-w-md items-center text-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
            {/* <Image src={avatarAnisha} className='object-contain w-16 -mt-14' alt='' /> */}
            <h5 className="text-lg font-bold">Anisha Li</h5>
            <p className="text-sm text-text">
              NYSC Abia Library is a valauable tol that has improved my academic
              research. A big shout out to the team behind it.”
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="flex flex-col mb-8 max-w-md self-end items-center text-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
            {/* <Image src={avatarAli} className='object-contain w-16 -mt-14' alt='' /> */}
            <h5 className="text-lg font-bold">Ali Bravo</h5>
            <p className="text-sm text-text">
              “We have been able to cancel so many other subscriptions since
              using NYSC Abia Library. There is no more cross-channel confusion
              and everyone is much more focused.”
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="flex flex-col mb-8 max-w-md items-center text-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
            {/* <Image src={avatarRichard} className='object-contain w-16 -mt-14' alt='' /> */}
            <h5 className="text-lg font-bold">Richard Watts</h5>
            <p className="text-sm text-text">
              NYSC Abia Library is a valauable tool that has improved my
              academic research. A big shout out to the team behind it.”
            </p>
          </div>
        </div>
        {/* Button */}
        <div className="mt-8 mb-16 text-center">
          {/* @ts-expect-error Error*/}
          <ButtonBase as={Link} href="/">
            Get Started
          </ButtonBase>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
