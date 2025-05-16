
export interface TimeSlot {
    id: string;
    start: string;  // ISO string
    end: string;    // ISO string
    available: boolean;
    price: number;
  }
  
  export interface CalendarConfig {
    slotDuration: number;  // in minutes
    workingHours: {
      start: string;  // "HH:mm"
      end: string;    // "HH:mm"
    };
  }