import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useRequest } from "../../hooks/useRequest";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export const MaintenanceCalendar = ({ view = "month", currentDate = new Date(), onViewChange, onNavigate }) => {
  const { calendarEvents, requests } = useRequest();

  // Transform requests to calendar events
  const events = (calendarEvents && calendarEvents.length > 0 ? calendarEvents : requests || [])
    .filter((r) => r.scheduledDate || r.scheduled_date)
    .map((r) => {
      const scheduledDate = r.scheduledDate || r.scheduled_date;
      const date = new Date(scheduledDate);
      
      return {
        id: r.requestId || r.id,
        title: r.subject || r.title || "Maintenance Request",
        start: date,
        end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
        priority: r.priority,
        stage: r.stage,
        equipment: r.equipment?.equipmentName || r.equipmentName,
        assignedTo: r.assignedTo?.fullName || r.assignedToName,
      };
    });

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3b82f6"; // default blue
    
    if (event.priority === "high") {
      backgroundColor = "#ef4444"; // red
    } else if (event.priority === "medium") {
      backgroundColor = "#f59e0b"; // yellow
    } else if (event.priority === "low") {
      backgroundColor = "#10b981"; // green
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px 4px",
      },
    };
  };

  const EventComponent = ({ event }) => {
    return (
      <div className="text-xs font-medium truncate">
        <div className="font-semibold">{event.title}</div>
        {event.equipment && (
          <div className="text-[10px] opacity-90 truncate">{event.equipment}</div>
        )}
      </div>
    );
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={view}
        view={view}
        date={currentDate}
        onView={onViewChange || (() => {})}
        onNavigate={onNavigate || (() => {})}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
        popup
        className="rounded-lg border border-slate-200"
      />
    </div>
  );
};
