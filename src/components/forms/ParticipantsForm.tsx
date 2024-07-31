'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
import { useStepper } from '../ui/stepper';
import { useFormStore } from '../../store';

function ParticipantsForm() {
  const t = useTranslations('ParticipantsForm');

  // State to keep track of the number of participants
  const [participants, setParticipants] = useState([{ id: 1, name: '' }]);
  const { nextStep, prevStep, isDisabledStep } = useStepper();
  const { formData, updateParticipants } = useFormStore();

  useEffect(() => {
    setParticipants(formData.participants.participants);
  }, [formData.participants.participants]);

  const addParticipant = () => {
    const newId = participants.length + 1;
    setParticipants([...participants, { id: newId, name: '' }]);
  };

  const handleParticipantChange = (id: number, value: string) => {
    const newParticipants = participants.map((participant) => {
      if (participant.id === id) {
        return { ...participant, name: value };
      }
      return participant;
    });
    setParticipants(newParticipants);
  };

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

  const saveParticipants = () => {
    updateParticipants({ participants });
    nextStep();
  };

  const handlePrevious = () => {
    updateParticipants({ participants });
    prevStep();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('number_of_participants')}</TableHead>
            <TableHead>{t('participant')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-semibold w-[10px]">
                {participant.id}
              </TableCell>
              <TableCell>
                <Label
                  htmlFor={`participant-${participant.id}`}
                  className="sr-only"
                >
                  {t('participant')}
                </Label>
                <Input
                  id={`participant-${participant.id}`}
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange(participant.id, e.target.value)
                  }
                  placeholder={t('participant_placeholder')}
                />
              </TableCell>
              <TableCell className="w-[10px]">
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
        className="gap-1 bg-succes text-white hover:bg-succes/90 mt-4 mb-5 "
      >
        <PlusCircle className="h-3.5 w-3.5 " />
        {t('participant_add')}
      </Button>
      <div className="w-full flex justify-end gap-2 pt-4">
        <Button
          disabled={isDisabledStep}
          onClick={handlePrevious}
          size="sm"
          variant="outline"
        >
          {t('previous_step')}
        </Button>
        <Button onClick={saveParticipants} size="sm">
          {t('next_step')}
        </Button>
      </div>
    </>
  );
}

export default ParticipantsForm;
