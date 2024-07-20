// src/components/forms/LocationTimeForm.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { LocationTimeSchema } from '@/schemas';
import { useFormStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from '@/components/ui/time-picker-input';
import { useStepper } from '../ui/stepper';
import { createTournament } from '../../app/actions/tournamentActions';

type LocationTimeData = z.infer<typeof LocationTimeSchema>;

export default function LocationTimeForm() {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date>();

  const { formData, updateLocationTime } = useFormStore();
  const { prevStep, isDisabledStep } = useStepper();

  const form = useForm<LocationTimeData>({
    resolver: zodResolver(LocationTimeSchema),
    defaultValues: formData.locationTime,
  });

  useEffect(() => {
    if (formData.locationTime) {
      form.reset(formData.locationTime);
    }
  }, [formData.locationTime, form]);

  const handleSubmit = form.handleSubmit(async (data: LocationTimeData) => {
    updateLocationTime(data);

    // Fetch complete form data from the store
    const completeFormData = {
      generalInfo: formData.generalInfo,
      locationTime: data,
      participants: formData.participants,
    };

    try {
      const response = await createTournament(completeFormData);
      console.log('Tournament created successfully:', response);
      // handle success, e.g., navigate to another page or show a success message
    } catch (error) {
      console.error('Error creating tournament:', error);
      // handle error, e.g., show an error message
    }
  });

  const handlePrevious = () => {
    const currentValues = form.getValues();
    updateLocationTime(currentValues);
    prevStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter location name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street and Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter street and number..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter zip code..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfCourts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Courts</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center">
              <FormLabel>Start Time</FormLabel>
              <div className="flex flex-col gap-4 ">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className=" gap-2 text-center flex items-center">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="hours" className="text-xs">
                      Ura
                    </Label>
                    <TimePickerInput
                      picker="hours"
                      date={date}
                      setDate={setDate}
                      ref={hourRef}
                      onRightFocus={() => minuteRef.current?.focus()}
                    />
                  </div>
                  <div className="flex flex-col  gap-1">
                    <Label htmlFor="minutes" className="text-xs">
                      Minuta
                    </Label>

                    <TimePickerInput
                      picker="minutes"
                      date={date}
                      setDate={setDate}
                      ref={minuteRef}
                      onRightFocus={() => minuteRef.current?.focus()}
                    />
                  </div>
                  <Clock className="ml-2 h-4 w-4 opacity-50 mt-4" />
                </div>
              </div>
              <FormDescription>
                Select the start date and time for the event.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="matchDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter match duration..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breakDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Break Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter break duration..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end gap-2 pt-4">
          <Button
            disabled={isDisabledStep}
            onClick={handlePrevious}
            size="sm"
            variant="outline"
          >
            Prejšnji korak
          </Button>
          <Button type="submit" size="sm">
            Ustvari turnir
          </Button>
        </div>
      </form>
    </Form>
  );
}
