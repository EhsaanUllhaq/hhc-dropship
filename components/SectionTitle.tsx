// *********************
// Role of the component: Section title that can be used on any page
// Name of the component: SectionTitle.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SectionTitle />
// Input parameters: {title: string; path: string}
// Output: div containing h1 for page title and p for page location path
// *********************

import React from "react";

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  return (
    <div className="h-[250px] border-b pt-16 border-white  mb-2 max-sm:h-[200px] max-sm:pt-16">
      <h1 className="section-title-title text-7xl text-center mb-7 max-md:text-7xl max-sm:text-5xl  max-sm:mb-2">
        {title}
      </h1>
      <p className="section-title-path text-xl text-center max-sm:text-xl ">
        {path}
      </p>
    </div>
  );
};

export default SectionTitle;
