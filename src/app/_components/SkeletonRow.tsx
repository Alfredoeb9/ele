"use client"

import { TableCell, TableRow } from "@nextui-org/react";
import React from "react"

const SkeletonRow = ({ columns }: { columns: number }) => {
    return (
      <TableRow>
        {Array.from({ length: columns }).map((_, index) => (
          <TableCell key={index}>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          </TableCell>
        ))}
      </TableRow>
    );
};

export default SkeletonRow;
