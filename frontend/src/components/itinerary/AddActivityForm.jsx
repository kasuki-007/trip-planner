import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.string().min(1),
  location: z.string().optional(),
  notes: z.string().optional(),
});


const typeOptions = Object.values(ACTIVITY_TYPES).map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

export function AddActivityForm({ onAdd, dayId }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'activity', time: '09:00' },
  });

  const onSubmit = async (data) => {
    await onAdd({
      dayId,
      title: data.title,
      time: data.time,
      type: data.type ,
      location: data.location,
      notes: data.notes,
      commentCount: 0,
    });
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:text-[#E94560] hover:bg-[#E94560]/5 rounded-xl border-2 border-dashed border-[#E0E0E0] hover:border-[#E94560]/40 transition-all group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Add activity
      </button>
    );
  }

  return (
    <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E0E0E0]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[#1A1A2E]">New activity</p>
        <button onClick={() => { reset(); setOpen(false); }} className="text-[#6B7280] hover:text-[#1A1A2E]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <Input
          placeholder="Activity title"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input type="time" error={errors.time?.message} {...register('time')} />
          <Select options={typeOptions} {...register('type')} />
        </div>
        <Input placeholder="Location (optional)" {...register('location')} />
        <Input placeholder="Notes (optional)" {...register('notes')} />
        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="secondary" size="sm" loading={isSubmitting} className="w-full">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}
