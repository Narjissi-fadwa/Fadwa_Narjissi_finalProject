import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowBigLeft, ArrowLeft } from 'lucide-react';

export default function PropertyShow({ property }) {
  const { auth } = usePage().props;
  const isAuthenticated = !!auth?.user;
  const isClientOrAdmin = ['client', 'admin'].includes(auth?.user?.role?.name);

  const calendarRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canBook = isAuthenticated && isClientOrAdmin && auth?.user?.id !== property.owner.id;

  const eventsUrl = useMemo(() => route('properties.viewings.index', property.id), [property.id]);

  const handleSelect = (arg) => {
    if (!canBook) return;
    setSelection({ start: arg.startStr, end: arg.endStr });
  };

  const closeDialog = () => {
    setSelection(null);
    setNotes('');
    setErrors(null);
  };

  const submitBooking = async () => {
    if (!selection) return;
    setIsSubmitting(true);
    setErrors(null);
    try {
      const res = await fetch(route('properties.viewings.store', property.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          start_at: selection.start,
          end_at: selection.end,
          notes: notes || undefined,
        }),
      });

      if (res.status === 201) {
        closeDialog();
        // Refetch events
        const api = calendarRef.current?.getApi();
        api?.refetchEvents();
      } else if (res.status === 422) {
        const data = await res.json();
        setErrors(data.errors || { form: ['Validation error'] });
      } else if (res.status === 403) {
        setErrors({ form: ['You are not authorized to create this booking.'] });
      } else {
        setErrors({ form: ['Unexpected error, please try again.'] });
      }
    } catch (e) {
      setErrors({ form: ['Network error, please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-cover bg-no-repeat bg-right relative">
      <div className="absolute inset-0 bg-slate-900/50"></div>
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1><Link href={route('properties.index')} className='flex items-center gap-2 text-white hover:text-emerald-300 font-medium'>
                                    <ArrowLeft></ArrowLeft>
                                    Back to properties
                                  </Link></h1>
          <div className="flex flex-col gap-8 ">
            <div className=" mx-auto w-[100%]">
              <div className='text-center' >
                {(property.images || []).slice(0, 4).map((src, idx) => (
                  <img key={idx} src={src} alt="" className="h-60 w-full rounded object-cover" />
                ))}
              </div>
              <h1 className="mt-4 text-2xl font-semibold">{property.title}</h1>
              <div className="mt-1 text-neutral-600">{property.address}</div>
              <div className="mt-2 text-lg">{Number(property.price).toLocaleString()} $</div>
              <div className="mt-1 text-sm">{property.type} • {property.area} m² • {property.bedrooms || '—'} bd</div>
              <p className="mt-4 whitespace-pre-line text-neutral-800">{property.description}</p>
            </div>
            <div className="lg:col-span-1">
              <div className="rounded border p-4">
                <div className="mb-2 text-sm text-neutral-600">Owner</div>
                <div className="text-base font-medium">{property.owner.name}</div>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold">Viewing calendar</h2>
                {!isAuthenticated && (
                  <div className="mb-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm">
                    Login to request a viewing:
                    <div className="mt-2 flex gap-2">
                      <Link className="underline" href={route('login')}>Login</Link>
                      <Link className="underline" href={route('register')}>Register</Link>
                    </div>
                  </div>
                )}
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  initialView="timeGridWeek"
                  height="auto"
                  selectable={canBook}
                  selectMirror
                  select={handleSelect}
                  events={(info, success, failure) => {
                    const url = `${eventsUrl}?start=${encodeURIComponent(info.startStr)}&end=${encodeURIComponent(info.endStr)}`;
                    fetch(url)
                      .then((r) => r.json())
                      .then(success)
                      .catch(failure);
                  }}
                  eventColor="#2563eb"
                  nowIndicator
                  headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' }}
                />
              </div>
            </div>
          </div>
        </div>

        <Dialog open={!!selection} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm viewing request</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-neutral-700">
                Start: <span className="font-medium">{selection?.start}</span>
                <br />
                End: <span className="font-medium">{selection?.end}</span>
              </div>
              <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              {errors && (
                <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                  {Object.values(errors).flat().join(' ')}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={submitBooking} disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


