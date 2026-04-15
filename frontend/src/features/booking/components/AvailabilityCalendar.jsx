import { useState } from 'react';

export default function AvailabilityCalendar({
  resourceName,
  selectedDate,
  onDateSelect,
  timeSlots,
  onApprove,
  onReject,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate.toISOString().split('T')[0]);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hasAvailableSlots = timeSlots.some(slot => !slot.isBooked);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Select Date for {resourceName}</h3>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 text-sm border border-blue-300 rounded hover:bg-blue-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-sm font-semibold text-blue-900">{monthName}</h4>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 text-sm border border-blue-300 rounded hover:bg-blue-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-blue-700">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDateClick(day)}
              disabled={!day}
              className={`p-2 rounded text-sm font-medium transition-colors ${
                !day
                  ? 'bg-transparent'
                  : selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-blue-200 text-blue-900 hover:bg-blue-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="text-xs text-blue-700">
          <strong>Selected:</strong> {selectedDate}
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booked Times on {selectedDate}</h3>

        <div className="space-y-3">
          {timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  slot.isBooked
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${slot.isBooked ? 'text-red-700' : 'text-green-700'}`}>
                      {slot.time}
                    </p>
                    {slot.isBooked && slot.booking && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Booked by:</strong> {slot.booking.requester} ({slot.booking.purpose})
                      </p>
                    )}
                    {!slot.isBooked && (
                      <p className="text-sm text-green-600 mt-1">Available</p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    slot.isBooked
                      ? 'bg-red-200 text-red-700'
                      : 'bg-green-200 text-green-700'
                  }`}>
                    {slot.isBooked ? 'BOOKED' : 'FREE'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No time slots available for this date</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          {hasAvailableSlots ? (
            <>
              <button
                onClick={onApprove}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Approve Booking
              </button>
              <button
                onClick={onReject}
                className="flex-1 px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={onReject}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              All Times Booked - Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
