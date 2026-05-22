import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useTeamStore } from '../../store/useTeamStore';
import { Button } from '../Button';
import { Input } from '../Input';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['Admin', 'Manager', 'Member']),
});

type FormValues = z.infer<typeof schema>;

export function InviteMemberModal() {
  const { isInviteMemberModalOpen, activeMemberId, closeInviteMemberModal, addToast } = useUIStore();
  const { members, addMember, updateMember } = useTeamStore();

  const editingMember = activeMemberId ? members.find(m => m.id === activeMemberId) : null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Member' },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingMember) {
      reset({ name: editingMember.name, email: editingMember.email, role: editingMember.role });
    } else {
      reset({ name: '', email: '', role: 'Member' });
    }
  }, [editingMember, reset, isInviteMemberModalOpen]);

  const onSubmit = (data: FormValues) => {
    if (editingMember) {
      updateMember(editingMember.id, { name: data.name, email: data.email, role: data.role });
      addToast({ title: 'Member updated', description: `${data.name}'s details have been saved.`, type: 'success' });
    } else {
      addMember({ name: data.name, email: data.email, role: data.role });
      addToast({ title: 'Invitation sent', description: `An invite was sent to ${data.email}.`, type: 'success' });
    }
    closeInviteMemberModal();
  };

  if (!isInviteMemberModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeInviteMemberModal}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{editingMember ? 'Edit Member' : 'Invite Team Member'}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {editingMember ? 'Update their role and details.' : 'They will receive an invitation email.'}
              </p>
            </div>
            <button onClick={closeInviteMemberModal} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editingMember && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input {...register('name')} placeholder="Jane Smith" error={!!errors.name} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-9"
                  placeholder="colleague@company.com"
                  {...register('email')}
                  error={!!errors.email}
                  readOnly={!!editingMember}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Role</label>
              <select
                {...register('role')}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Admin">Admin — Full workspace access</option>
                <option value="Manager">Manager — Manage projects and members</option>
                <option value="Member">Member — View and contribute</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeInviteMemberModal}>Cancel</Button>
              <Button type="submit">{editingMember ? 'Save Changes' : 'Send Invite'}</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
