import React from "react";
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiHome, BiBookAlt, BiBuildingHouse, BiMessage, BiSolidReport, BiStats } from 'react-icons/bi';
import { ImCancelCircle } from "react-icons/im";
import { RiCustomerService2Line } from "react-icons/ri";
export const Sidebar = [
    {
        title: "Dashboard",
        path: '/dashboard',
        icon: <MdDashboard />,
        cName: 'nav_text',
    },
    {
        title: "Available properties",
        path: '/Available_properties',
        icon: <BiBuildingHouse />,
        cName: 'nav_text',
    },
    {
        title: "My Properties",
        path: '/my_properties',
        icon: <BiMessage />,
        cName: 'nav_text',
    },
    {
        title: "Billing Details",
        path: '/billing_details',
        icon: <BiSolidReport />,
        cName: 'nav_text',
    },
    {
        title: "Payment Receipt",
        path: '/payment_receipt',
        icon: <BiStats />,
        cName: 'nav_text',
    },
    {
        title: "Cancellation Process",
        path: '/cancellation_process',
        icon: <ImCancelCircle />,
        cName: 'nav_text',
    },

    {
        title: "Customer Queries",
        path: '/customer_quires',
        icon: <RiCustomerService2Line  />,
        cName: 'nav_text',
    },
];