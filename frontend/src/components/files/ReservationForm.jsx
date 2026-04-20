import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  type: z.enum(['hotel', 'flight', 'restaurant', 'car', 'other']),
  name: z.string().min(1, 'Name is required'),
  bookingRef: z.string().min(1, 'Booking reference is required'),
  checkIn: z.string().min(1, 'Date is required'),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
});




export function ReservationForm({ isOpen, onClose, onSave }) {
  const { currentUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'hotel' },
  });

  const onSubmit = async (data) => {
    await onSave({
      type: data.type,
      name: data.name,
      bookingRef: data.bookingRef,
      checkIn: data.checkIn,
      checkOut: data.checkOut || null,
      notes: data.notes,
      confirmedBy: currentUser?.id ?? '',
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add reservation"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="secondary" form="reservation-form" type="submit" loading={isSubmitting}>Save</Button>
        </>
      }
    >
      <form id="reservation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Type"
          options={[
            { value: 'hotel', label: 'Hotel' },
            { value: 'flight', label: 'Flight' },
            { value: 'restaurant', label: 'Restaurant' },
            { value: 'car', label: 'Car rental' },
            { value: 'other', label: 'Other' },
          ]}
          {...register('type')}
        />
        <Input label="Name" placeholder="Hotel name / Flight number" error={errors.name?.message} {...register('name')} />
        <Input label="Booking reference" placeholder="REF-12345" error={errors.bookingRef?.message} {...register('bookingRef')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Check-in / Date" type="date" error={errors.checkIn?.message} {...register('checkIn')} />
          <Input label="Check-out (optional)" type="date" {...register('checkOut')} />
        </div>
        <Input label="Notes (optional)" placeholder="Additional details..." {...register('notes')} />
      </form>
    </Modal>
  );
}
