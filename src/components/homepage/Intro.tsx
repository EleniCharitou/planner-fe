import { FaArrowRight } from "react-icons/fa";

const Intro = () => {
  return (
    <section className="bg-violet-950 mt-12 w-screen items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
          Your space to plan and track your next trip/adventure
        </h1>
        <p className="mb-8 text-lg font-normal text-white lg:text-xl sm:px-16 lg:px-48 text-left">
          Everythning in one place for your next trip planning for you and your
          friends. <br />
          - Create a list with your ideas and the places you want to visit.
          <br /> - Add editional information on each plave or activity you want
          to include, like location, tickets, openning hours, etc.
          <br /> - Organize everything in a Kanban board
          <br /> - Keep track of the activities you did and which of them you
          wan tto do them next time
          <br /> - Rate every activity, add photos, write your feelings, and a
          funny memory or a memory to remember
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <a
            href="#"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium 
                       text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 
                       focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Get started
            <FaArrowRight className="pl-3 w-7" />
          </a>
          <a
            href="#"
            className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default Intro;
