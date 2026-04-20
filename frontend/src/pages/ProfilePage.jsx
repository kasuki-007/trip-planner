import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});


export function ProfilePage() {
  const { currentUser, updateProfile } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: currentUser?.name ?? '', avatar: currentUser?.avatar ?? '' },
  });

  const onSubmit = async (data) => {
    updateProfile({ name: data.name, avatar: data.avatar || undefined });
    toast.success('Profile updated');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader title="Your Profile" subtitle="Manage your account details" />

      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={currentUser.name} src={currentUser.avatar} size="lg" />
          <div>
            <p className="font-semibold text-[#1A1A2E] text-lg">{currentUser.name}</p>
            <p className="text-[#6B7280] text-sm">{currentUser.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Display Name" error={errors.name?.message} {...register('name')} />
          <Input
            label="Avatar URL (optional)"
            placeholder="https://..."
            helperText="Paste a direct image URL to use as your avatar."
            error={errors.avatar?.message}
            {...register('avatar')}
          />
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Email</label>
            <input
              type="text"
              value={currentUser.email}
              disabled
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E0E0E0] rounded-lg text-[#6B7280] text-sm cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-[#6B7280]">Email cannot be changed in Phase 1.</p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
