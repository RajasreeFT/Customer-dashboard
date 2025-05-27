import React from "react";
import { motion } from "framer-motion";
import "../pages/Amenities.css";

const amenities = [
  {
    id: 1,
    title: "Resorts",
    image:
      "https://www.adanirealty.com/-/media/Project/Realty/Blogs/Blog-2-Banner-Image.jpg",
    description:
      "The Hyderabad Regional Ring Road (RRR) is a proposed 340-kilometer, four-lane, access-controlled expressway designed to improve connectivity, reduce traffic congestion, and boost economic growth in and around Hyderabad, Telangana.",
  },
  {
    id: 2,
    title: "Resorts",
    image:
      "https://www.adanirealty.com/-/media/Project/Realty/Blogs/Blog-2-Banner-Image.jpg",
    description:
      "The Hyderabad Regional Ring Road (RRR) is a proposed 340-kilometer, four-lane, access-controlled expressway designed to improve connectivity, reduce traffic congestion, and boost economic growth in and around Hyderabad, Telangana.",
  },
  {
    id: 3,
    title: "Resorts",
    image:
      "https://www.adanirealty.com/-/media/Project/Realty/Blogs/Blog-2-Banner-Image.jpg",
    description:
      "The Hyderabad Regional Ring Road (RRR) is a proposed 340-kilometer, four-lane, access-controlled expressway designed to improve connectivity, reduce traffic congestion, and boost economic growth in and around Hyderabad, Telangana.",
  },
  {
    id: 4,
    title: "Resorts",
    image:
      "https://www.adanirealty.com/-/media/Project/Realty/Blogs/Blog-2-Banner-Image.jpg",
    description:
      "The Hyderabad Regional Ring Road (RRR) is a proposed 340-kilometer, four-lane, access-controlled expressway designed to improve connectivity, reduce traffic congestion, and boost economic growth in and around Hyderabad, Telangana.",
  },
  {
    id: 5,
    title: "Resorts",
    image:
      "https://www.adanirealty.com/-/media/Project/Realty/Blogs/Blog-2-Banner-Image.jpg",
    description:
      "The Hyderabad Regional Ring Road (RRR) is a proposed 340-kilometer, four-lane, access-controlled expressway designed to improve connectivity, reduce traffic congestion, and boost economic growth in and around Hyderabad, Telangana.",
  },
];

const Amenities = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-2 mb-8 space-y-6">
      <h2 className="text-3xl font-bold text-green-600 mt-6">
        Our Premium Amenities
      </h2>
      {amenities.map((amenity, index) => (
        <motion.div
          key={amenity.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 3.0, ease: "easeOut" }}
          className="amenities_cont w-full flex items-center"
        >
          <div
            className={`flex items-center w-full ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <img
                src={amenity.image}
                alt={amenity.title}
                className="w-81 h-40 rounded-full"
              />
            </div>
            <div className="w-30 h-30 flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-xl font-bold">{amenity.title}</h3>
              <p className="text-sm">{amenity.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Amenities;
