'use client';

import React, { useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { GroupWithParticipants } from '../types';

interface GroupSwitcherProps {
  groups: GroupWithParticipants[];
}

function GroupSwitcher({ groups }: GroupSwitcherProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    groups.length > 0 ? groups[0].id : null,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const renderGroup = (groupId: string) => {
    const group = groups.find((filteredGroup) => filteredGroup.id === groupId);
    if (!group) return null;

    const sortedParticipants = [...group.participants].sort(
      (a, b) => b.points - a.points,
    );

    return (
      <div key={group.id} className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedParticipants.map((participant, index) => (
              <TableRow key={participant.id}>
                <TableCell>
                  {index + 1}
                  {['st', 'nd', 'rd'][index] || 'th'}
                </TableCell>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Groups</h2>
      <div className="relative flex items-center">
        <div
          ref={scrollContainerRef}
          className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide"
        >
          {groups.map((group) => (
            <Button
              variant="outline"
              key={group.id}
              className={`px-4 py-2 rounded ${
                selectedGroup === group.id
                  ? 'bg-white text-black'
                  : 'bg-primary'
              }`}
              onClick={() => setSelectedGroup(group.id)}
            >
              {group.name}
            </Button>
          ))}
        </div>
      </div>
      {selectedGroup && renderGroup(selectedGroup)}
    </div>
  );
}

export default GroupSwitcher;
