import { MdCardTravel } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-teal-700 w-full">
      <div className="mx-auto w-full max-w-screen-xl p-2 lg:py-6">
        <div className="md:flex md:justify-around">
          <div className="mb-2 md:mb-0">
            <button type="button" className="flex items-center">
              <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white flex items-center">
                <MdCardTravel size="30px" className="mr-2" />
                Trip planner
              </span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase text-white">
                Resources
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-2">
                  <button type="button" className="hover:underline">
                    React
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline">
                    Tailwind CSS
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-white uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-white dark:text-gray-400 font-medium">
                <li className="mb-2">
                  <button type="button" className="hover:underline">
                    Github
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline">
                    Discord
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-white uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-white dark:text-gray-400 font-medium">
                <li className="mb-2">
                  <button type="button" className="hover:underline">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline">
                    Terms &amp; Conditions
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-2" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-gray-400">
            © 2025 <span className="hover:underline">Charitou Eleni™ </span>.
            All Rights Reserved.
          </span>
          <div className="flex mt-2 sm:justify-center sm:mt-0">
            <button
              type="button"
              className="text-white hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">GitHub account</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
