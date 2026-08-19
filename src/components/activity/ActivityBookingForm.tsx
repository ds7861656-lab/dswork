import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDaysIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import {
  type Activity,
  type ActivityBookingType,
  type ActivityBookingFormData
} from '../../types/activity';

interface ActivityBookingFormProps {
  activity: Activity;
}

type CalendarView = 'days' | 'months' | 'years';

interface DateTimeState {
  dateText: string;
  dateObj: Date | null;
}

const DEFAULT_DATE_TEXT = 'Wed, 12 April';

function buildInitialDateObj(): Date {
  const d = new Date();
  d.setDate(12);
  return d;
}

const ActivityBookingForm: React.FC<ActivityBookingFormProps> = ({ activity }) => {
  const { t, i18n } = useTranslation();
  void i18n;
  const navigate = useNavigate();

  const [placeCount, setPlaceCount] = useState(1);
  const [goproCount, setGoproCount] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');

  const [single, setSingle] = useState<DateTimeState>(() => buildInitialDateTimeState());
  const [startDate, setStartDate] = useState<DateTimeState>(() => buildInitialDateTimeState());
  const [endDate, setEndDate] = useState<DateTimeState>(() => buildInitialDateTimeState());

  const singleCalendar = useCalendarInstance();
  const startCalendar = useCalendarInstance();
  const endCalendar = useCalendarInstance();

  const bookingType: ActivityBookingType = activity.bookingType || 'singleDate';

  function buildBookingFormData(): ActivityBookingFormData {
    const base: ActivityBookingFormData = {
      bookingType,
      placeCount,
      goproCount: activity.hasGoPro ? goproCount : 0,
      firstName,
      lastName,
      email,
      countryCode,
      phone
    };
    if (bookingType === 'singleDate') {
      return {
        ...base,
        singleDateText: single.dateText,
        singleDateObjISO: single.dateObj ? single.dateObj.toISOString() : undefined
      };
    }
    return {
      ...base,
      startDateText: startDate.dateText,
      startDateObjISO: startDate.dateObj ? startDate.dateObj.toISOString() : undefined,
      endDateText: endDate.dateText,
      endDateObjISO: endDate.dateObj ? endDate.dateObj.toISOString() : undefined
    };
  }

  function handleBookNow() {
    const formData = buildBookingFormData();
    navigate(`/activity/${activity.id}/confirm`, { state: { formData } });
  }

  return (
    <div className="bg-transparent p-0 flex flex-col">
      {/* ============ 日期区：根据 bookingType 切换 ============ */}
      {bookingType === 'singleDate' ? (
        <SingleDateSection
          label={t('activity.selectionDate')}
          state={single}
          setState={setSingle}
          calendar={singleCalendar}
        />
      ) : (
        <>
          <DateTimeRow
            label={t('activity.range.start')}
            state={startDate}
            setState={setStartDate}
            calendar={startCalendar}
          />
          <div className="mt-6">
            <DateTimeRow
              label={t('activity.range.end')}
              state={endDate}
              setState={setEndDate}
              calendar={endCalendar}
            />
          </div>
          <div className="mb-8" />
        </>
      )}

      {/* Place reservation */}
      <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-4 gap-y-0 items-center mb-8">
        <label className="text-xl font-bold text-[#2d4b5a] shrink-0">
          {t('activity.placeReservation')}
        </label>
        <div className="flex items-center gap-3 justify-start">
          <input
            type="number"
            min={1}
            value={placeCount}
            onChange={(e) => setPlaceCount(Math.max(1, parseInt(e.target.value || '1', 10)))}
            className="bg-gray-200 rounded-xl h-11 px-4 text-center text-base font-medium text-[#2d4b5a] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors w-[18rem] shrink-0"
          />
          <span className="text-xl font-bold text-[#2d4b5a] shrink-0">
            {t('activity.person')}
          </span>
        </div>
      </div>

      {/* GoPro Film */}
      {activity.hasGoPro && (
        <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-4 gap-y-0 items-center mb-10">
          <label className="text-xl font-bold text-[#2d4b5a] shrink-0">
            {t('activity.goproFilm.title')}
          </label>
          <div className="flex items-center gap-3 justify-start">
            <input
              type="number"
              min={0}
              value={goproCount}
              onChange={(e) => setGoproCount(Math.max(0, parseInt(e.target.value || '0', 10)))}
              className="bg-gray-200 rounded-xl h-11 px-4 text-center text-base font-medium text-[#2d4b5a] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors w-[18rem] shrink-0"
            />
            <span className="text-xl font-bold text-[#2d4b5a] shrink-0">
              {t('activity.person')}
            </span>
          </div>
        </div>
      )}

      {/* Enter contact */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-[#2d4b5a] mb-5">
          {t('activity.enterContact')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder={t('activity.firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <input
            type="text"
            placeholder={t('activity.lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <input
            type="email"
            placeholder={t('activity.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <div className="relative">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl px-4 pr-9 py-3 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="+1">+1</option>
              <option value="+86">+86</option>
              <option value="+33">+33</option>
              <option value="+44">+44</option>
              <option value="+34">+34</option>
              <option value="+966">+966</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
          <input
            type="tel"
            placeholder={t('activity.mobilePhone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Book now button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleBookNow}
          className="bg-[#2d4b5a] text-white px-10 py-3 rounded-2xl text-lg font-bold hover:bg-[#1f3642] transition-colors shadow-sm"
        >
          {t('activity.bookNow')}
        </button>
      </div>
    </div>
  );
};

/* ===========================================================
   Hooks
   =========================================================== */

function buildInitialDateTimeState(): DateTimeState {
  const d = new Date();
  d.setDate(12);
  return {
    dateText: DEFAULT_DATE_TEXT,
    dateObj: d
  };
}

interface CalendarInstance {
  isOpen: boolean;
  setIsOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  view: CalendarView;
  setView: (v: CalendarView) => void;
  viewMonth: Date;
  setViewMonth: React.Dispatch<React.SetStateAction<Date>>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
}

function useCalendarInstance(): CalendarInstance {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CalendarView>('days');
  const [viewMonth, setViewMonth] = useState<Date>(() => buildInitialDateObj());
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    view,
    setView,
    viewMonth,
    setViewMonth,
    triggerRef,
    panelRef,
    onToggle: () => setIsOpen((o) => !o)
  };
}

/* ===========================================================
   UI Sub components (rendered inline via functions)
   =========================================================== */

type DateTimeStateSetter = React.Dispatch<React.SetStateAction<DateTimeState>>;

function SingleDateSection(props: {
  label: string;
  state: DateTimeState;
  setState: DateTimeStateSetter;
  calendar: CalendarInstance;
}) {
  const { label, state, setState, calendar } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-4 gap-y-0 items-center mb-8">
      <label className="text-xl font-bold text-[#2d4b5a] shrink-0">{label}</label>
      <div className="flex items-center gap-3 justify-start relative">
        <div className="bg-gray-200 text-[#2d4b5a] px-5 rounded-xl text-base font-medium h-11 flex items-center justify-center w-[18rem] shrink-0">
          {state.dateText}
        </div>
        <CalendarTrigger
          calendar={calendar}
          onSelectDate={(day) => {
            setState((prev) => ({
              ...prev,
              dateObj: day,
              dateText: format(day, 'EEE, d MMMM')
            }));
            calendar.setIsOpen(false);
            calendar.setViewMonth(day);
          }}
          selectedDateObj={state.dateObj}
        />
      </div>
    </div>
  );
}

function DateTimeRow(props: {
  label: string;
  state: DateTimeState;
  setState: DateTimeStateSetter;
  calendar: CalendarInstance;
}) {
  const { label, state, setState, calendar } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-4 gap-y-0 items-center">
      <label className="text-xl font-bold text-[#2d4b5a] shrink-0">{label}</label>
      <div className="flex items-center gap-3 justify-start relative">
        <div className="bg-gray-200 text-[#2d4b5a] px-5 rounded-xl text-base font-medium h-11 flex items-center justify-center w-[18rem] shrink-0">
          {state.dateText}
        </div>
        <CalendarTrigger
          calendar={calendar}
          onSelectDate={(day) => {
            setState((prev) => ({
              ...prev,
              dateObj: day,
              dateText: format(day, 'EEE, d MMMM')
            }));
            calendar.setIsOpen(false);
            calendar.setViewMonth(day);
          }}
          selectedDateObj={state.dateObj}
        />
      </div>
    </div>
  );
}

function CalendarTrigger(props: {
  calendar: CalendarInstance;
  onSelectDate: (d: Date) => void;
  selectedDateObj: Date | null;
}) {
  const { calendar, onSelectDate, selectedDateObj } = props;
  return (
    <div ref={calendar.triggerRef} className="relative">
      <button
        type="button"
        onClick={calendar.onToggle}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
          calendar.isOpen
            ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-100'
            : 'border-gray-200 bg-white text-[#2d4b5a] hover:bg-gray-50'
        }`}
      >
        <CalendarDaysIcon className="w-5 h-5" />
      </button>

      {calendar.isOpen && (
        <CalendarPanel
          calendar={calendar}
          onSelectDate={onSelectDate}
          selectedDateObj={selectedDateObj}
        />
      )}
    </div>
  );
}

function CalendarPanel(props: {
  calendar: CalendarInstance;
  onSelectDate: (d: Date) => void;
  selectedDateObj: Date | null;
}) {
  const { calendar, onSelectDate, selectedDateObj } = props;
  const { view, viewMonth, setView, setViewMonth, panelRef } = calendar;

  const handlePrev = () => {
    if (view === 'days') setViewMonth((d) => subMonths(d, 1));
    else if (view === 'months') setViewMonth((d) => addMonths(d, -12));
    else setViewMonth((d) => addMonths(d, -12 * 12));
  };
  const handleNext = () => {
    if (view === 'days') setViewMonth((d) => addMonths(d, 1));
    else if (view === 'months') setViewMonth((d) => addMonths(d, 12));
    else setViewMonth((d) => addMonths(d, 12 * 12));
  };
  const handleHeaderClick = () => {
    if (view === 'days') setView('months');
    else if (view === 'months') setView('years');
  };
  const handleSelectMonth = (idx: number) => {
    const d = new Date(viewMonth);
    d.setMonth(idx);
    setViewMonth(d);
    setView('days');
  };
  const handleSelectYear = (y: number) => {
    const d = new Date(viewMonth);
    d.setFullYear(y);
    setViewMonth(d);
    setView('months');
  };

  const monthLabels = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), 'MMM'));
  }, []);
  const yearRange = useMemo(() => {
    const base = viewMonth.getFullYear();
    const start = Math.floor(base / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => start + i);
  }, [viewMonth]);
  const calendarCells = useMemo(() => {
    const s = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
    const e = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: s, end: e });
  }, [viewMonth]);
  const weekdayLabels = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return format(d, 'EEE');
    });
  }, []);

  return (
    <div
      ref={panelRef}
      className="absolute left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 z-50 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handlePrev}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleHeaderClick}
          className={`px-2 py-1 rounded-lg hover:bg-gray-50 text-sm font-bold text-[#2d4b5a] transition-colors ${
            view === 'years' ? 'cursor-default' : 'cursor-pointer'
          }`}
          disabled={view === 'years'}
        >
          {view === 'days' && format(viewMonth, 'MMMM yyyy')}
          {view === 'months' && format(viewMonth, 'yyyy')}
          {view === 'years' && `${yearRange[0]} - ${yearRange[yearRange.length - 1]}`}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {view === 'days' && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayLabels.map((w) => (
              <div
                key={w}
                className="h-6 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-wider"
              >
                {w.slice(0, 1)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const today = isToday(day);
              const selected = selectedDateObj && isSameDay(day, selectedDateObj);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`h-8 w-full rounded-lg text-xs transition-colors flex items-center justify-center ${
                    selected
                      ? 'bg-teal-600 text-white font-bold shadow hover:bg-teal-700'
                      : today
                        ? 'bg-gray-100 text-[#2d4b5a] font-semibold hover:bg-gray-200'
                        : inMonth
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </>
      )}

      {view === 'months' && (
        <div className="grid grid-cols-3 gap-2 py-1">
          {monthLabels.map((label, idx) => {
            const d = new Date(viewMonth);
            d.setMonth(idx);
            const same =
              selectedDateObj &&
              isSameMonth(d, selectedDateObj) &&
              d.getFullYear() === selectedDateObj.getFullYear();
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleSelectMonth(idx)}
                className={`h-12 rounded-lg text-xs transition-colors flex items-center justify-center ${
                  same
                    ? 'bg-teal-600 text-white font-bold shadow hover:bg-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {view === 'years' && (
        <div className="grid grid-cols-3 gap-2 py-1">
          {yearRange.map((y) => {
            const same = selectedDateObj && selectedDateObj.getFullYear() === y;
            return (
              <button
                key={y}
                type="button"
                onClick={() => handleSelectYear(y)}
                className={`h-12 rounded-lg text-xs transition-colors flex items-center justify-center ${
                  same
                    ? 'bg-teal-600 text-white font-bold shadow hover:bg-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   Helpers
   =========================================================== */

export default ActivityBookingForm;
