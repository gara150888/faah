"use client";

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip";

interface Props {
    children: React.ReactElement;
    content: React.ReactNode;
}

export default function ToolTipWrapper({ children, content }: Props) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger render={children} />
                <TooltipContent>{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}