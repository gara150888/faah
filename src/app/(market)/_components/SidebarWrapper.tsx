"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("~/app/(market)/_components/Sidebar"), {
    ssr: false,
});

export default Sidebar;