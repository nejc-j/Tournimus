// src/components/forms/GeneralInfoForm.tsx

'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GeneralInfoSchema } from '@/schemas';
import { useFormStore } from '@/store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useStepper } from '../ui/stepper';

type GeneralInfoData = z.infer<typeof GeneralInfoSchema>;

export default function GeneralInfoForm() {
  const { formData, updateGeneralInfo } = useFormStore();
  const { nextStep, prevStep, isDisabledStep } = useStepper();

  const form = useForm<GeneralInfoData>({
    resolver: zodResolver(GeneralInfoSchema),
    defaultValues: formData.generalInfo,
  });

  useEffect(() => {
    if (formData.generalInfo) {
      form.reset(formData.generalInfo);
    }
  }, [formData.generalInfo, form]);

  const handleSubmit = form.handleSubmit((data) => {
    updateGeneralInfo(data);
    nextStep();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="tournamentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="presenter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presenter</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end gap-2 pt-4">
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="outline"
          >
            Prejšnji korak
          </Button>
          <Button onClick={handleSubmit} size="sm">
            Naslednji korak
          </Button>
        </div>
      </form>
    </Form>
  );
}
