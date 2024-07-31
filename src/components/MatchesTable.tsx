/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */

'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Participant } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MatchWithDetails } from '../types';
import ResultModal from '@/components/ResultModal';

interface MatchesTableProps {
  matches: MatchWithDetails[];
  matchDuration: number;
}

export default function MatchesTable({
  matches,
  matchDuration,
}: MatchesTableProps) {
  const [selectedMatch, setSelectedMatch] =
    React.useState<MatchWithDetails | null>(null);

  const columns: ColumnDef<MatchWithDetails>[] = [
    {
      accessorKey: 'number',
      header: 'Number',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'participants',
      header: 'Match',
      cell: ({ row }) => {
        const participants = row.original.participants as Participant[];
        return (
          <>
            {participants[0].name} vs {participants[1].name}
          </>
        );
      },
    },
    {
      accessorKey: 'results',
      header: 'Score',
      cell: ({ row }) => {
        const { results } = row.original;
        return (
          <>
            {results.map((result) => (
              <div key={`${result.participantId}-${result.score}`}>
                {result.participantId === row.original.participants[0].id
                  ? result.score
                  : ''}
                {result.participantId === row.original.participants[1].id
                  ? result.score
                  : ''}
              </div>
            ))}
          </>
        );
      },
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => {
        return new Date(row.original.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isLive = isMatchLive(row.original.startTime);
        return isLive ? 'Live' : 'Upcoming';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setSelectedMatch(row.original)}
          >
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: matches,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isMatchLive = (startTime: Date): boolean => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + matchDuration * 60000);
    const now = new Date();
    return now >= start && now <= end;
  };

  return (
    <div className="rounded-md ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedMatch && (
        <ResultModal
          match={selectedMatch}
          open={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
