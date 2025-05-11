export type Holiday = {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type HolidayResponse = {
  holiday: Holiday;
};

export type HolidaysResponse = {
  holidays: Holiday[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type cloneYear = {
  year: string;
};
