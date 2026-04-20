import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/Modal';
import { useTrip, useUpdateTrip, useDeleteTrip } from '../hooks/useTrip';
import { usePermissions } from '../hooks/usePermissions';
import { useTripStore } from '../store/tripStore';
import { useUIStore } from '../store/uiStore';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  budget: z.preprocess((v) => (v === '' || v == null ? undefined : Number(v)), z.number().min(0).optional()),
  description: z.string().optional(),
});


export function TripSettingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: trip, isLoading } = useTrip(id);
  const { mutateAsync: updateTrip } = useUpdateTrip();
  const { mutateAsync: deleteTrip } = useDeleteTrip();
  const { clearActiveTrip } = useTripStore();
  const { openModal, closeModal, activeModal } = useUIStore();
  const { canDeleteTrip } = usePermissions();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (trip) {
      reset({
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        coverImage: trip.coverImage ?? '',
        budget: trip.budget ?? 0,
        description: trip.description ?? '',
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data) => {
    await updateTrip({ id: id, data });
    toast.success('Trip updated');
  };

  const handleDeleteTrip = async () => {
    await deleteTrip(id);
    clearActiveTrip();
    toast.success('Trip deleted');
    navigate('/dashboard');
    closeModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Trip Settings" subtitle="Edit trip details and manage settings" />

      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Trip Title" error={errors.title?.message} {...register('title')} />
          <Input label="Destination" error={errors.destination?.message} {...register('destination')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" error={errors.startDate?.message} {...register('startDate')} />
            <Input label="End Date" type="date" error={errors.endDate?.message} {...register('endDate')} />
          </div>
          <Input label="Cover Image URL (optional)" placeholder="https://..." error={errors.coverImage?.message} {...register('coverImage')} />
          <Input label="Budget (INR)" type="number" step="100" error={errors.budget?.message} {...register('budget')} />
          <Textarea label="Description (optional)" rows={3} {...register('description')} />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Changes</Button>
          </div>
        </form>
      </div>

      {canDeleteTrip && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h3 className="font-semibold text-red-600 mb-1">Danger Zone</h3>
          <p className="text-sm text-[#6B7280] mb-4">Permanently delete this trip and all its data. This action cannot be undone.</p>
          <Button variant="danger" onClick={() => openModal('deleteTrip')}>
            <Trash2 className="w-4 h-4" /> Delete Trip
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={activeModal === 'deleteTrip'}
        onClose={closeModal}
        onConfirm={handleDeleteTrip}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? All data including itinerary, budget, and files will be permanently removed."
        confirmLabel="Delete Trip"
      />
    </div>
  );
}
