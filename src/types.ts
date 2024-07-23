export interface Tournament {
  id: string;
  name: string;
  numberOfCourts: number;
  startTime: Date;
  matchDuration: number;
  breakDuration: number;
  locationName: string;
  street: string;
  city: string;
  zipCode: string;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}
