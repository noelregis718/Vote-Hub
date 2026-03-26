"use client";

import * as React from "react";
import { format, setMonth, setYear } from "date-fns";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function DropdownMultiCalendar({ onConfirm, initialDate }) {
  const today = new Date();
  const [month, setMonthState] = React.useState(today.getMonth());
  const [year, setYearState] = React.useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = React.useState(initialDate ? [new Date(initialDate)] : []);

  const handleRemove = (date) => {
    setSelectedDates((prev) =>
      prev.filter((d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd"))
    );
  };

  const handleMonthChange = (newMonth) => {
    setMonthState(newMonth);
  };

  const handleYearChange = (newYear) => {
    setYearState(newYear);
  };

  const displayMonth = setMonth(setYear(today, year), month);

  return (
    <Card className="w-[400px] shadow-none border border-white/10 bg-black/40 backdrop-blur-xl">
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Dropdowns */}
        <div className="flex gap-2">
          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(val) => handleYearChange(Number(val))}
          >
            <SelectTrigger className="w-[140px] glass-input">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {Array.from({ length: 50 }, (_, i) => year - 25 + i).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select
            value={month.toString()}
            onValueChange={(val) => handleMonthChange(Number(val))}
          >
            <SelectTrigger className="w-[140px] glass-input">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2000, i, 1), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendar */}
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={(dates) => setSelectedDates(dates ?? [])}
          month={displayMonth}
          onMonthChange={(date) => {
            setMonthState(date.getMonth());
            setYearState(date.getFullYear());
          }}
          className="rounded-md border border-white/5 bg-transparent"
        />

        {/* Selected dates list */}
        <div className="flex flex-wrap gap-2">
          {selectedDates.length === 0 && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">No dates selected</p>
          )}
          {selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((d) => (
              <Badge
                key={d.toISOString()}
                variant="secondary"
                className="flex items-center gap-2 bg-white/10 text-white border-white/10"
              >
                {format(d, "PPP")}
                <button
                  className="h-4 w-4 p-0 text-slate-400 hover:text-white transition-colors"
                  onClick={() => handleRemove(d)}
                >
                  ✕
                </button>
              </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0">
        <Button
          size="sm"
          className="glass-button h-8 px-4"
          onClick={() => onConfirm?.(selectedDates)}
          disabled={selectedDates.length === 0}
        >
          Confirm Date
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DropdownMultiCalendar };
