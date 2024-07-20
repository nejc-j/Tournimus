'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

function ParticipantsForm() {
  // State to keep track of the number of participants
  const [participants, setParticipants] = useState([{ id: 1, name: '' }]);

  // Function to handle adding new participants
  const addParticipant = () => {
    const newId = participants.length + 1; // Calculate new ID as the next number in sequence
    setParticipants([...participants, { id: newId, name: '' }]);
  };

  // Function to handle participant name changes
  const handleParticipantChange = (id: number, value: string) => {
    const newParticipants = participants.map((participant) => {
      if (participant.id === id) {
        return { ...participant, name: value };
      }
      return participant;
    });
    setParticipants(newParticipants);
  };

  // Function to handle deletion of a participant
  const deleteParticipant = (id: number) => {
    const updatedParticipants = participants.filter(
      (participant) => participant.id !== id,
    );
    // Recalculate IDs to be sequential
    const reindexedParticipants = updatedParticipants.map(
      (participant, index) => ({
        ...participant,
        id: index + 1,
      }),
    );
    setParticipants(reindexedParticipants);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Št.</TableHead>
            <TableHead>Udeleženec</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-semibold">{participant.id}</TableCell>
              <TableCell>
                <Label
                  htmlFor={`participant-${participant.id}`}
                  className="sr-only"
                >
                  Udeleženec
                </Label>
                <Input
                  id={`participant-${participant.id}`}
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange(participant.id, e.target.value)
                  }
                  placeholder="Enter participant's name"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => deleteParticipant(participant.id)}
                  size="sm"
                  className="bg-red-500 hover:bg-red-400"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={addParticipant}
        size="sm"
        className="gap-1 bg-succes text-white hover:bg-succes/90"
      >
        <PlusCircle className="h-3.5 w-3.5 " />
        Dodaj udeleženca
      </Button>
    </>
  );
}

export default ParticipantsForm;