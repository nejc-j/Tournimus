'use client';

import * as React from 'react';
import { Participant } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MatchWithDetails } from '../types';
import {
  updateMatchResultAction,
  endMatchAndCalculatePoints,
} from '@/app/actions/tournamentActions';

interface ResultModalProps {
  match: MatchWithDetails;
  open: boolean;
  onClose: () => void;
}

function ResultModal({ match, open, onClose }: ResultModalProps) {
  const [scores, setScores] = React.useState<{ [key: string]: number }>(() =>
    match.results.reduce(
      (acc, result) => {
        acc[result.participantId] = result.score;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEnding, setIsEnding] = React.useState(false);

  const handleScoreChange = React.useCallback(
    (participantId: string, newScore: number) => {
      setScores((prev) => ({ ...prev, [participantId]: newScore }));
    },
    [],
  );

  const handleSave = React.useCallback(async () => {
    setIsSubmitting(true);
    const results = Object.entries(scores).map(([participantId, score]) => ({
      participantId,
      score,
    }));

    try {
      const response = await updateMatchResultAction(match.id, results);
      if (response.success) {
        console.log('SUCCESS');
        onClose();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error updating match result:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [match.id, scores, onClose]);

  const handleEndMatch = React.useCallback(async () => {
    setIsEnding(true);
    try {
      const response = await endMatchAndCalculatePoints(match.id);
      if (response.success) {
        console.log('Match ended successfully');
        onClose();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error ending match:', error);
    } finally {
      setIsEnding(false);
    }
  }, [match.id, onClose]);

  const modalContent = React.useMemo(
    () => (
      <div className="space-y-4">
        {match.participants.map((participant: Participant) => (
          <div key={participant.id} className="flex items-center space-x-2">
            <span className="w-1/3">{participant.name}</span>
            <Button
              onClick={() =>
                handleScoreChange(
                  participant.id,
                  Math.max(0, (scores[participant.id] || 0) - 1),
                )
              }
              variant="outline"
              size="sm"
            >
              -
            </Button>
            <Input
              type="number"
              value={scores[participant.id] || 0}
              onChange={(e) =>
                handleScoreChange(
                  participant.id,
                  Math.max(0, parseInt(e.target.value, 10) || 0),
                )
              }
              className="w-20 text-center"
            />
            <Button
              onClick={() =>
                handleScoreChange(
                  participant.id,
                  (scores[participant.id] || 0) + 1,
                )
              }
              variant="outline"
              size="sm"
            >
              +
            </Button>
          </div>
        ))}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Scores'}
          </Button>
          {match.status !== 'FINISHED' && (
            <Button
              onClick={handleEndMatch}
              disabled={isSubmitting || isEnding}
            >
              {isEnding ? 'Ending...' : 'End Match'}
            </Button>
          )}
        </div>
      </div>
    ),
    [
      match.participants,
      match.status,
      onClose,
      isSubmitting,
      handleSave,
      handleEndMatch,
      isEnding,
      scores,
      handleScoreChange,
    ],
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Match Results</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );

  /*

  To je za drawer, trenutno neki ne dela ok
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Update Match Results</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">{modalContent}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  */
}

export default ResultModal;
