import { useField } from "formik";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react"; // calendar icon

interface CalendarFieldProps {
  label: string;
  name: string;
}

const CalendarField: React.FC<CalendarFieldProps> = ({ label, name }) => {
  const [field, , helpers] = useField(name);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {/* Date Picker */}
        {/* <DatePicker
          selected={field.value ? new Date(field.value) : null}
          onChange={(date) => helpers.setValue(date)}
          className="w-full px-3 py-2 pr-10 bg-gray-100 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#BB9D7B]"
          dateFormat="dd/MM/yyyy"
          placeholderText="Select date"
        /> */}

        {/* Calendar Icon */}
        <CalendarIcon
          className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default CalendarField;
