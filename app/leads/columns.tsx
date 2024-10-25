"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export type Lead = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  tweet: string;
  followerCount: number;
  topics: string[];
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const username = row.original.username;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("name")}</span>
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            @{username}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "bio",
    header: "Bio",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("bio")}>
        {row.getValue("bio")}
      </div>
    ),
  },
  {
    accessorKey: "tweet",
    header: "Latest Tweet",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("tweet")}>
        {row.getValue("tweet")}
      </div>
    ),
  },
  {
    accessorKey: "followerCount",
    header: "Followers",
    cell: ({ row }) => (
      <span>{Number(row.getValue("followerCount")).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "topics",
    header: "Matching Topics",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
