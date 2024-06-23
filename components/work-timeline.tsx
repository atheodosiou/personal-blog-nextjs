"use client";
import React, { useState } from "react";

export interface TimelineItem {
  title: string;
  date: string;
  company: string;
  description: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full sm:px-6 lg:px-8 py-10">
      <div className="relative border-l border-gray-200 dark:border-gray-700">
        {items.map((item: TimelineItem, index: number) => (
          <div key={index} className="mb-10 ml-4 sm:ml-10 md:ml-16 lg:ml-24 text-justify">
            <div className="absolute w-3 h-3 bg-blue-700 rounded-full mt-1.5 -left-[6.3px] border border-white dark:border-gray-900"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-blue-500">
                {item.title}
              </h3>
              <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500 sm:ml-4">
                {item.date}
              </time>
            </div>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {item.company}
            </p>
            <p
              className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${
                expandedIndex === index ? "" : "line-clamp-2"
              }`}
            >
              {item.description}
            </p>
            <button
              onClick={() => toggleExpand(index)}
              className="text-blue-700 mt-2 text-sm"
            >
              {expandedIndex === index ? "Show Less" : "Show More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;

// // Timeline.js
// import React from "react";

// export interface TimelineItem {
//   title: string;
//   date: string;
//   company: string;
//   description: string;
// }

// export interface TimelineProps {
//   items: TimelineItem[];
// }

// const Timeline: React.FC<TimelineProps> = ({ items }) => {
//   return (
//     <div className="w-full sm:px-6 lg:px-8 py-10">
//       <h1 className="text-4xl font-bold mb-10 text-center">
//         My Work Experience
//       </h1>
//       <div className="relative border-l border-gray-200 dark:border-gray-700">
//         {items.map((item: any, index: number) => (
//           <div key={index} className="mb-10 ml-4 sm:ml-10 md:ml-16 lg:ml-24">
//             <div
//               className={`absolute w-3 h-3 bg-blue-700 rounded-full mt-1.5 -left-[6.3px] border border-white dark:border-gray-900 ${
//                 index === 0 ? "animate-pulse" : ""
//               }`}
//             ></div>
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
//               <h3
//                 className={`text-lg font-semibold ${
//                   index === 0 ? "text-blue-500 animate-pulse" : ""
//                 }`}
//               >
//                 {item.title}
//               </h3>
//               <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500 sm:ml-4">
//                 {item.date}
//               </time>
//             </div>
//             <p className="text-base font-normal text-gray-500 dark:text-gray-400">
//               {item.company}
//             </p>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               {item.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Timeline;
