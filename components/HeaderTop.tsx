// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaPhone } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();
  const siteAdminInfo = {
    email: "denseven706@gmail.com",
    phone: "+92 317 5829612",
    phone2: "+92 343 5311543",
  };

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };
  return (
    <div className="h-10   max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <div className="flex items-center font-semibold gap-x-5">
          {/* Container for phone 1 */}
          <div className="relative group/phone1 flex items-center">
            <FaPhone className="w-10 h-10 text-blue-600 group-hover/phone1:text-blue-800 transition-colors cursor-pointer p-3 rounded-full group-hover/phone1:bg-blue-50" />
            <a
              href={`tel:${siteAdminInfo.phone}`}
              className="ml-2 opacity-0 w-0 group-hover/phone1:w-auto absolute left-0 group-hover/phone1:left-10 z-0 group-hover/phone1:z-10 group-hover/phone1:opacity-100 transition-all duration-500 whitespace-nowrap text-gray-700 hover:text-blue-600 bg-white px-2 py-1 rounded z-10 pointer-events-auto"
            >
              {siteAdminInfo.phone}
            </a>
            {/* Invisible bridge to keep hover active */}
            <div className="absolute left-10 w-4 h-full"></div>
          </div>

          {/* Container for phone 2 */}
          <div className="relative group/phone2 flex items-center transition-transform duration-300 group-hover/phone2:translate-x-28">
            <FaPhone className="w-10 h-10 text-green-600 group-hover/phone2:text-green-800 transition-colors cursor-pointer p-3 rounded-full group-hover/phone2:bg-green-50" />
            <a
              href={`tel:${siteAdminInfo.phone2}`}
              className="ml-2 opacity-0 w-0 group-hover/phone2:w-auto absolute left-0 group-hover/phone2:left-10 z-0 group-hover/phone2:z-10 group-hover/phone2:opacity-100 transition-all duration-500 whitespace-nowrap text-gray-700 hover:text-blue-600 bg-white px-2 py-1 rounded z-10 pointer-events-auto"
            >
              {siteAdminInfo.phone2}
            </a>
            <div className="absolute left-10 w-4 h-full"></div>
          </div>

          {/* Container for email */}
          <div className="relative group/adminEmail flex items-center transition-transform duration-300 group-hover/adminEmail:translate-x-28 group-hover/adminEmail:translate-x-32">
            <FaRegEnvelope className="w-10 h-10 text-purple-600 group-hover/adminEmail:text-purple-800 transition-colors cursor-pointer text-xl p-3 rounded-full group-hover/adminEmail:bg-purple-50" />
            <a
              href={`mailto:${siteAdminInfo.email}`}
              className="ml-2 opacity-0 w-0 group-hover/adminEmail:w-auto absolute left-0 group-hover/adminEmail:left-10 z-0 group-hover/adminEmail:z-10 group-hover/adminEmail:opacity-100 transition-all duration-500 whitespace-nowrap text-gray-700 hover:text-blue-600 bg-white px-2 py-1 rounded z-10 pointer-events-auto"
            >
              {siteAdminInfo.email}
            </a>
            <div className="absolute left-10 w-4 h-full"></div>
          </div>
        </div>
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
          {!session ? (
            <>
              <li className="flex items-center">
                <Link
                  href="/login"
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="" />
                  <span>Login</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  href="/register"
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <span className="ml-10 text-base">{session.user?.email}</span>
              <li className="flex items-center">
                <button
                  onClick={() => handleLogout()}
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="" />
                  <span>Log out</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
