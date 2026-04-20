import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCreateTrip } from '../../hooks/useTrip';
import toast from 'react-hot-toast';
import { ROLES } from '../../constants/roles';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  budget: z.string().optional(),
}).refine((d) => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});


export function CreateTripModal({ isOpen, onClose }) {
  const { currentUser } = useAuthStore();
  const { mutateAsync: createTrip } = useCreateTrip();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if (!currentUser) return;
    try {
      await createTrip({
        title: data.title,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        coverImage: data.coverImage || undefined,
        description: data.description,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        currency: 'USD',
        members: [{ userId: currentUser.id, role: ROLES.OWNER }],
      });
      toast.success('Trip created!');
      reset();
      onClose();
    } catch {
      toast.error('Failed to create trip');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new trip"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="secondary" form="create-trip-form" type="submit" loading={isSubmitting}>
            Create trip
          </Button>
        </>
      }
    >
      <form id="create-trip-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Trip title"
          placeholder="Bali Summer Escape"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Destination"
          placeholder="Bali, Indonesia"
          error={errors.destination?.message}
          {...register('destination')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="End date"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>
        <Input
          label="Cover image URL"
          placeholder="https://unsplash.com/..."
          error={errors.coverImage?.message}
          {...register('coverImage')}
        />
        <Input
          label="Budget (USD)"
          type="number"
          placeholder="5000"
          error={errors.budget?.message}
          {...register('budget')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1A1A2E]">Description (optional)</label>
          <textarea
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#E0E0E0] bg-white text-[#1A1A2E] placeholder-[#6B7280] resize-none outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
            rows={2}
            placeholder="What's this trip about?"
            {...register('description')}
          />
        </div>
      </form>
    </Modal>
  );
}
