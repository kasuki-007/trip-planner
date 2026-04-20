import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.enum(['editor', 'viewer']),
});


export function InviteModal({ isOpen, onClose, onInvite }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'editor' },
  });

  const onSubmit = async (data) => {
    try {
      await onInvite(data.email, data.role);
      toast.success(`Invite sent to ${data.email}`);
      reset();
      onClose();
    } catch {
      toast.error('Failed to send invite');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite member"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="secondary" form="invite-form" type="submit" loading={isSubmitting}>Send invite</Button>
        </>
      }
    >
      <form id="invite-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="friend@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Role"
          options={[
            { value: 'editor', label: 'Editor — can add and edit' },
            { value: 'viewer', label: 'Viewer — read only' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />
      </form>
    </Modal>
  );
}
