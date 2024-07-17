/* eslint-disable no-nested-ternary */

'use client';

import React from 'react';
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from '@/components/ui/stepper';
import { Button } from '../../components/ui/button';
import { GeneralInfoForm } from '../../components/forms/GeneralInfoForm';
import ParticipantsForm from '../../components/forms/ParticipantsForm';
import { LocationTimeForm } from '../../components/forms/LocationTimeForm';

const steps = [
  { label: 'Splošne informacije' },
  { label: 'Udeleženci' },
  { label: 'Lokacija, Čas, Dodatne Nastavitve' },
] satisfies StepItem[];

export default function StepperDemo() {
  return (
    <div className="flex w-full  gap-4 mt-20 max-w-6xl mx-auto p-4 flex-col ">
      <Stepper initialStep={0} steps={steps} className="ps-0">
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <StepContent step={index} />
            </Step>
          );
        })}
        <Footer />
      </Stepper>
    </div>
  );
}

function StepContent({ step }) {
  switch (step) {
    case 0:
      return <GeneralInfoForm />;
    case 1:
      return <ParticipantsForm />;
    case 2:
      return <LocationTimeForm />;
    default:
      return null;
  }
}

function Footer() {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prejšnji korak
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep
                ? 'Finish'
                : isOptionalStep
                  ? 'Prejšnji korak'
                  : 'Naslednji korak'}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
