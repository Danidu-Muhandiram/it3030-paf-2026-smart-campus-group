import { useState } from 'react';

// Mock data - replace with API call
const RESOURCES = [
  { id: '1', name: 'Conference Room A', capacity: 20 },
  { id: '2', name: 'Meeting Room B', capacity: 10 },
  { id: '3', name: 'Auditorium', capacity: 100 },
  { id: '4', name: 'Board Room', capacity: 15 }
];

export function BookingRequestForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resourceId) {
      newErrors.resourceId = 'Please select a resource';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot book in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Please enter start time';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Please enter end time';
    }

    if (formData.startTime && formData.endTime) {
      const [startHour, startMin] = formData.startTime.split(':');
      const [endHour, endMin] = formData.endTime.split(':');
      const startTotalMin = parseInt(startHour) * 60 + parseInt(startMin);
      const endTotalMin = parseInt(endHour) * 60 + parseInt(endMin);

      if (endTotalMin <= startTotalMin) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please enter the purpose of the booking';
    }

    if (!formData.expectedAttendees) {
      newErrors.expectedAttendees = 'Please enter number of expected attendees';
    } else {
      const attendees = parseInt(formData.expectedAttendees);
      if (attendees < 1) {
        newErrors.expectedAttendees = 'At least 1 attendee is required';
      }
      
      const selectedResource = RESOURCES.find(r => r.id === formData.resourceId);
      if (selectedResource && attendees > selectedResource.capacity) {
        newErrors.expectedAttendees = `Exceeds room capacity of ${selectedResource.capacity}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const selectedResource = RESOURCES.find(
        (r) => r.id === formData.resourceId
      );

      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      function convertTo24Hour(time) {
        if (!time) return "";
      
        // already 24h format (08:00)
        if (time.includes(":") && !time.includes("AM") && !time.includes("PM")) {
          return time + ":00";
        }
      
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
      
        if (modifier === "PM" && hours !== "12") {
          hours = String(parseInt(hours, 10) + 12);
        }
      
        if (modifier === "AM" && hours === "12") {
          hours = "00";
        }
      
        return `${hours}:${minutes}:00`;
      }

      const requestData = {
        resourceName: selectedResource?.name,
        bookingDate: formatDate(formData.date),
        startTime: convertTo24Hour(formData.startTime),
        endTime: convertTo24Hour(formData.endTime),
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees)
      };

      console.log("FINAL REQUEST:", requestData);

      if (onSubmit) {
        await onSubmit(requestData);
      }
    } catch (error) {
      alert(error?.message || 'Failed to submit booking request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resource Selection */}
        <div className="space-y-2">
          <label htmlFor="resource" className="text-sm font-semibold text-text-main">
            Select Resource <span className="text-red-500">*</span>
          </label>
          <select
            id="resource"
            value={formData.resourceId}
            onChange={(e) => {
              setFormData({ ...formData, resourceId: e.target.value });
              setErrors({ ...errors, resourceId: '' });
            }}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${errors.resourceId ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Choose a resource...</option>
            {RESOURCES.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} (Capacity: {resource.capacity})
              </option>
            ))}
          </select>
          {errors.resourceId && (
            <p className="text-xs text-red-600 font-medium">{errors.resourceId}</p>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-semibold text-text-main">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              setErrors({ ...errors, date: '' });
            }}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.date && (
            <p className="text-xs text-red-600 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-semibold text-text-main">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => {
                setFormData({ ...formData, startTime: e.target.value });
                setErrors({ ...errors, startTime: '' });
              }}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${errors.startTime ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.startTime && (
              <p className="text-xs text-red-600 font-medium">{errors.startTime}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-semibold text-text-main">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => {
                setFormData({ ...formData, endTime: e.target.value });
                setErrors({ ...errors, endTime: '' });
              }}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${errors.endTime ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.endTime && (
              <p className="text-xs text-red-600 font-medium">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <label htmlFor="purpose" className="text-sm font-semibold text-text-main">
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            id="purpose"
            placeholder="Describe the purpose of this booking..."
            value={formData.purpose}
            onChange={(e) => {
              setFormData({ ...formData, purpose: e.target.value });
              setErrors({ ...errors, purpose: '' });
            }}
            rows={4}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors resize-none ${errors.purpose ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.purpose && (
            <p className="text-xs text-red-600 font-medium">{errors.purpose}</p>
          )}
        </div>

        {/* Expected Attendees */}
        <div className="space-y-2">
          <label htmlFor="attendees" className="text-sm font-semibold text-text-main">
            Expected Attendees <span className="text-red-500">*</span>
          </label>
          <input
            id="attendees"
            type="number"
            min="1"
            placeholder="Enter number of expected attendees"
            value={formData.expectedAttendees}
            onChange={(e) => {
              setFormData({ ...formData, expectedAttendees: e.target.value });
              setErrors({ ...errors, expectedAttendees: '' });
            }}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${errors.expectedAttendees ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.expectedAttendees && (
            <p className="text-xs text-red-600 font-medium">{errors.expectedAttendees}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm"
          >
            {isLoading ? 'Submitting Request...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </div>
  );
}