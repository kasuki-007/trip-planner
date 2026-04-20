import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { eachDayOfInterval, parseISO, format } from 'date-fns';
import { DayColumn } from '../components/itinerary/DayColumn';
import { CommentDrawer } from '../components/itinerary/CommentDrawer';
import { useItinerary, useAddActivity, useReorderActivities, useAddDay } from '../hooks/useItinerary';
import { useTrip } from '../hooks/useTrip';
import { Button } from '../components/ui/Button';
import { PermissionGate } from '../components/trip/PermissionGate';
import { CalendarDays, Plus, Wand2 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function ItineraryPage() {
  const { id } = useParams();
  const { data: days, isLoading } = useItinerary(id);
  const { data: trip } = useTrip(id);
  const { mutateAsync: addActivity } = useAddActivity(id);
  const { mutateAsync: reorderActivities } = useReorderActivities(id);
  const { mutateAsync: addDay, isPending: addingDay } = useAddDay(id);
  const [activeActivity, setActiveActivity] = useState(null);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newDayDate, setNewDayDate] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleAddActivity = async (dayId, data) => {
    try {
      await addActivity({ dayId, activity: data });
      toast.success('Activity added');
    } catch {
      toast.error('Failed to add activity');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !days) return;

    // Find which day contains these activities
    for (const day of days) {
      const activityIds = day.activities.map((a) => a.id);
      if (activityIds.includes(String(active.id))) {
        const oldIndex = activityIds.indexOf(String(active.id));
        const newIndex = activityIds.indexOf(String(over.id));
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(activityIds, oldIndex, newIndex);
          await reorderActivities({ dayId: day.id, orderedIds: newOrder });
        }
        break;
      }
    }
  };

  const handleAddDay = async () => {
    if (!newDayDate) return;
    try {
      await addDay(newDayDate);
      toast.success('Day added');
      setShowAddDay(false);
      setNewDayDate('');
    } catch (err) {
      toast.error((err )?.message ?? 'Failed to add day');
    }
  };

  const handleGenerateDays = async () => {
    if (!trip?.startDate || !trip?.endDate) {
      toast.error('Trip has no start/end dates set');
      return;
    }
    const dates = eachDayOfInterval({ start: parseISO(trip.startDate), end: parseISO(trip.endDate) });
    let added = 0;
    for (const date of dates) {
      try {
        await addDay(format(date, 'yyyy-MM-dd'));
        added++;
      } catch {
        // skip duplicate dates
      }
    }
    toast.success(`${added} day${added !== 1 ? 's' : ''} added`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Itinerary</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Day-by-day plan</p>
        </div>
        <PermissionGate require="canEdit">
          <div className="flex gap-2 shrink-0">
            {trip?.startDate && trip?.endDate && (
              <Button variant="outline" size="sm" onClick={handleGenerateDays} loading={addingDay}>
                <Wand2 className="w-4 h-4" />
                Generate Days
              </Button>
            )}
            <Button size="sm" onClick={() => setShowAddDay(true)}>
              <Plus className="w-4 h-4" />
              Add Day
            </Button>
          </div>
        </PermissionGate>
      </div>

      {showAddDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowAddDay(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-[#1A1A2E] mb-4">Add Day</h3>
            <input
              type="date"
              value={newDayDate}
              onChange={(e) => setNewDayDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowAddDay(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddDay} loading={addingDay} disabled={!newDayDate}>Add</Button>
            </div>
          </div>
        </div>
      )}

      {!days || days.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-8 h-8" />}
          title="No itinerary yet"
          description="Add days to start planning your trip."
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {days.map((day) => (
              <DayColumn
                key={day.id}
                day={day}
                onAddActivity={handleAddActivity}
                onCommentClick={setActiveActivity}
              />
            ))}
          </div>
        </DndContext>
      )}

      <CommentDrawer
        tripId={id}
        activity={activeActivity}
        onClose={() => setActiveActivity(null)}
      />
    </div>
  );
}
