/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { TimePickerInput } from '../ui/time-picker-input';
import { format } from 'date-fns';
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
import React from 'react';
import { Label } from '../ui/label';

const FormSchema = z.object({
  locationName: z
    .string()
    .min(2, { message: 'Location name must be at least 2 characters.' }),
  street: z.string().min(1, { message: 'Street and number are required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  zipCode: z.string().min(1, { message: 'Zip code is required.' }),
  numberOfCourts: z
    .number()
    .min(1, { message: 'There must be at least one court.' }),
  startTime: z.date(),
  matchDuration: z
    .number()
    .min(1, { message: 'Match duration must be at least 1 minute.' }),
  breakDuration: z
    .number()
    .min(1, { message: 'Break duration must be at least 1 minute.' }),
});

export function LocationTimeForm() {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const [date, setDate] = React.useState<Date>();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locationName: '',
      street: '',
      city: '',
      zipCode: '',
      numberOfCourts: 1,
      startTime: new Date(),
      matchDuration: 30,
      breakDuration: 5,
    },
  });

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormItem className="flex flex-col">
              <FormLabel>Start Time</FormLabel>
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
              <FormDescription>
                Select the start date for the event.
              </FormDescription>
              <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-xs">
                  Hours
                </Label>
                <TimePickerInput
                  picker="hours"
                  date={date}
                  setDate={setDate}
                  ref={hourRef}
                  onRightFocus={() => minuteRef.current?.focus()}
                />
              </div>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
