// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import { navigation } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <div>
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-24 pb-14">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <Image
              src="/site/logo-vertical.jpg"
              alt="Singitronic logo"
              width={360}
              height={123}
              className="h-auto w-auto"
            />
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 col-span-2 md:gap-8">
                <div className="hidden">
                  <h3 className="text-lg font-bold leading-6 text-blue-600">
                    Sale
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.sale.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-black hover:text-gray-700"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0 col-span-2 flex items-center gap-x-4">
                  <h3 className="text-base font-bold leading-6 text-blue-600">
                    About Us
                  </h3>
                  <ul
                    role="list"
                    className="flex items-center justify-between gap-x-3"
                  >
                    {navigation.about.map((item) => (
                      <>
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm leading-6 text-black hover:text-gray-500"
                          >
                            {item.name}
                          </a>
                        </li>
                        <div className="h-3 w-0.5 bg-gray-200 last-of-type:hidden" />
                      </>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8 !hidden">
                <div>
                  <h3 className="text-base font-bold leading-6 text-blue-600">
                    Buying
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.buy.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-black hover:text-gray-700"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-base font-bold leading-6 text-blue-600">
                    Support
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.help.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-black hover:text-gray-700"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
