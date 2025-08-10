import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function OwnerCalendar() {
  const { auth } = usePage().props;
  const ownerId = auth?.user?.id;
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsUrl = useMemo(() => route('owners.calendar', ownerId), [ownerId]);

  return (
    <AppLayout>
      
      <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-contain bg-no-repeat  bg-right relative">
      <div className="absolute inset-0 bg-slate-900/30"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">My properties calendar</h1>
        <FullCalendar className="w-full"
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="timeGridWeek"
          height="auto"
          selectable={false}
          events={(info, success, failure) => {
            const url = `${eventsUrl}?start=${encodeURIComponent(info.startStr)}&end=${encodeURIComponent(info.endStr)}`;
            fetch(url)
              .then((r) => r.json())
              .then(success)
              .catch(failure);
          }}
          eventClick={(arg) => setSelectedEvent({
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.startStr,
            end: arg.event.endStr,
            extendedProps: arg.event.extendedProps,
          })}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' }}
        />
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Viewing details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Property:</span> {selectedEvent.extendedProps.property_title}</div>
              <div><span className="font-medium">Client:</span> {selectedEvent.extendedProps.client_name}</div>
              <div><span className="font-medium">Status:</span> {selectedEvent.extendedProps.status}</div>
              <div><span className="font-medium">Start:</span> {selectedEvent.start}</div>
              <div><span className="font-medium">End:</span> {selectedEvent.end}</div>
              {selectedEvent.extendedProps.notes && (
                <div><span className="font-medium">Notes:</span> {selectedEvent.extendedProps.notes}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}


