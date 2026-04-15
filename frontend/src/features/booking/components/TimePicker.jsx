import { useState } from 'react';

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = 'HH:MM',
  disabled = false
}) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Validate time format HH:MM
    if (val && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        type="time"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  );
}
