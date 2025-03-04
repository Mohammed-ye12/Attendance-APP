import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import type { ShiftType, Employee, ShiftEntry } from '../types';

interface Props {
  employee: Employee;
  onSubmit: (shiftType: ShiftType, date: string, otherRemark?: string) => void;
  entries: ShiftEntry[];
  initialStep?: 'date' | 'shift';
  onStepChange?: (step: 'date' | 'shift') => void;
}

const shiftTypes: { value: ShiftType; label: string; description: string }[] = [
  { value: '1st_shift', label: '1st Shift', description: '6:00 AM - 2:00 PM' },
  { value: '2nd_shift', label: '2nd Shift', description: '2:00 PM - 10:00 PM' },
  { value: '3rd_shift', label: '3rd Shift', description: '10:00 PM - 6:00 AM' },
  { value: 'leave', label: 'Leave', description: 'Full Day Leave' },
  { value: 'medical', label: 'Medical Leave', description: 'Medical Emergency/Appointment' },
  { value: 'ot_off_day', label: 'OT as Off Day', description: 'Overtime on Regular Off Day' },
  { value: 'ot_week_off', label: 'OT as Week Off', description: 'Overtime on Weekly Off' },
  { value: 'ot_public_holiday', label: 'OT as Public Holiday', description: 'Overtime on Public Holiday' },
  { value: 'other', label: 'Other', description: 'Other Types (Please Specify)' }
];

export function ShiftRegistration({ employee, onSubmit, entries, initialStep = 'date', onStepChange }: Props) {
  const [currentStep, setCurrentStep] = useState<'date' | 'shift'>(initialStep);
  const [selectedDate, setSelectedDate] = useState('');
  const [shiftType, setShiftType] = useState<ShiftType>('1st_shift');
  const [otherRemark, setOtherRemark] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  useEffect(() => {
    // Generate array of dates for the selected week
    const dates = [];
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    setWeekDates(dates);
  }, [selectedWeek]);

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  // Check if a date has been used
  const isDateUsed = (dateStr: string) => {
    return entries.some(entry => 
      entry.employeeId === employee.id && entry.date === dateStr
    );
  };

  const todayUsed = isDateUsed(todayStr);
  const tomorrowUsed = isDateUsed(tomorrowStr);

  const handleDateSelect = (dateStr: string) => {
    if (isDateUsed(dateStr)) {
      setError(`You have already submitted an entry for ${new Date(dateStr).toLocaleDateString()}`);
      return;
    }
    setSelectedDate(dateStr);
    setCurrentStep('shift');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (shiftType === 'other' && !otherRemark.trim()) {
      setError('Please provide a remark for other shift type');
      return;
    }

    try {
      await onSubmit(shiftType, selectedDate, shiftType === 'other' ? otherRemark : undefined);
      setShowSuccess(true);
      setError('');
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep('date');
        setSelectedDate('');
        setShiftType('1st_shift');
        setOtherRemark('');
      }, 3000);
    } catch (err) {
      console.error('Error submitting shift:', err);
      setError('Failed to submit shift. Please try again.');
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek);
    if (direction === 'prev') {
      newWeek.setDate(newWeek.getDate() - 7);
    } else {
      newWeek.setDate(newWeek.getDate() + 7);
    }
    setSelectedWeek(newWeek);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        {currentStep === 'date' ? (
          <Calendar className="w-6 h-6 text-blue-600" />
        ) : (
          <Clock className="w-6 h-6 text-blue-600" />
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          {currentStep === 'date' ? 'Select Date' : 'Select Shift'}
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Welcome,</p>
        <p className="font-medium text-gray-800">
          {employee.fullName} (ID: {employee.id})
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Department: {employee.department}
          {employee.section && ` - Section: ${employee.section}`}
        </p>
      </div>

      {currentStep === 'date' ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* Today's date option */}
            <button
              onClick={() => handleDateSelect(todayStr)}
              disabled={todayUsed}
              className={`
                p-4 rounded-lg border-2 transition-colors relative
                ${todayUsed 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                  : 'border-blue-500 hover:bg-blue-50 cursor-pointer'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg text-gray-900">Today</p>
                  <p className="text-sm text-gray-600">
                    {today.toLocaleDateString('default', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {todayUsed && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Already Submitted
                  </span>
                )}
              </div>
            </button>

            {/* Tomorrow's date option */}
            <button
              onClick={() => handleDateSelect(tomorrowStr)}
              disabled={tomorrowUsed}
              className={`
                p-4 rounded-lg border-2 transition-colors relative
                ${tomorrowUsed 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                  : 'border-blue-500 hover:bg-blue-50 cursor-pointer'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg text-gray-900">Tomorrow</p>
                  <p className="text-sm text-gray-600">
                    {tomorrow.toLocaleDateString('default', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {tomorrowUsed && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Already Submitted
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Weekly Calendar View */}
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <button 
                onClick={() => navigateWeek('prev')}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <h3 className="font-medium text-gray-700">
                {weekDates.length > 0 && (
                  `${weekDates[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })} - 
                   ${weekDates[6].toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
                )}
              </h3>
              
              <button 
                onClick={() => navigateWeek('next')}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2 border-b text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const isUsed = isDateUsed(dateStr);
                const past = isPastDate(date);
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => !isUsed && !past && handleDateSelect(dateStr)}
                    disabled={isUsed || past}
                    className={`
                      py-3 relative
                      ${isToday(date) ? 'bg-blue-50' : ''}
                      ${isUsed || past ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100 cursor-pointer'}
                    `}
                  >
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full mx-auto
                      ${isToday(date) ? 'bg-blue-500 text-white' : ''}
                    `}>
                      {date.getDate()}
                    </span>
                    
                    {isUsed && (
                      <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-500">
                        <div className="w-4 h-1 bg-gray-300 mx-auto rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-4">
              <AlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          {todayUsed && tomorrowUsed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800">
                  You have already submitted entries for both today and tomorrow.
                  Please check back tomorrow for new availability or select a date from the calendar.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Selected Date
              </label>
              <button
                type="button"
                onClick={() => setCurrentStep('date')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change Date
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-md text-gray-800 font-medium">
              {new Date(selectedDate).toLocaleDateString('default', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Type
            </label>
            <div className="space-y-2">
              {shiftTypes.map(type => (
                <label
                  key={type.value}
                  className={`
                    block p-3 rounded-lg border cursor-pointer transition-colors
                    ${shiftType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shiftType"
                      value={type.value}
                      checked={shiftType === type.value}
                      onChange={(e) => setShiftType(e.target.value as ShiftType)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {type.label}
                        </p>
                        {shiftType === type.value && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {shiftType === 'other' && (
            <div>
              <label htmlFor="otherRemark" className="block text-sm font-medium text-gray-700">
                Specify Reason
              </label>
              <textarea
                id="otherRemark"
                value={otherRemark}
                onChange={(e) => setOtherRemark(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
                rows={3}
                placeholder="Please provide details..."
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 relative"
            disabled={showSuccess}
          >
            {showSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Entry Completed!
              </span>
            ) : (
              'Complete Entry'
            )}
          </button>
        </form>
      )}
    </div>
  );
}