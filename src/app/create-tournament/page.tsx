// StepperDemo.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { Step, Stepper } from '@/components/ui/stepper';

import { Card } from '@/components/ui/card';
import GeneralInfoForm from '../../components/forms/GeneralInfoForm';
import ParticipantsForm from '../../components/forms/ParticipantsForm';
import LocationTimeForm from '../../components/forms/LocationTimeForm';

const steps = [
  { label: 'Splošne informacije' },
  { label: 'Udeleženci' },
  { label: 'Lokacija, Čas, Dodatne Nastavitve' },
];
interface StepContentProps {
  step: number; // Define the type for the `step` prop
}

function StepContent({ step }: StepContentProps) {
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

export default function StepperDemo() {
  return (
    <div className="relative w-full h-full min-h-screen">
      <Image
        src="/background-stadium.png"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute inset-0 flex w-full gap-4 mt-20 max-w-6xl mx-auto p-4 flex-col">
        <h1 className="text-white text-center text-4xl font-semibold pb-4">
          Ustvari turnir
        </h1>
        <Card className="bg-primary/60 backdrop-blur-md p-6 text-white border-tertiary/50 ">
          <Stepper initialStep={0} steps={steps} className="ps-0 pb-4">
            {steps.map(({ label }, index) => (
              <Step key={label} label={label}>
                <StepContent step={index} />
              </Step>
            ))}
          </Stepper>
        </Card>
      </div>
    </div>
  );
}
