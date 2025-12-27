import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useRequest } from "../../hooks/useRequest";

const localizer = momentLocalizer(moment);

export const MaintenanceCalendar=()=> {
  const { requests } = useRequest();

  const events = requests
    .filter(r => r.scheduled_date)
    .map(r => ({
      title: r.subject,
      start: new Date(r.scheduled_date),
      end: new Date(r.scheduled_date),
    }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: 600 }}
      />
    </div>
  );
}
