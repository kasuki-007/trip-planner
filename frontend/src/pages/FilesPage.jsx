import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Files as FilesIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FileCard } from '../components/files/FileCard';
import { ReservationCard } from '../components/files/ReservationCard';
import { ReservationForm } from '../components/files/ReservationForm';
import { PermissionGate } from '../components/trip/PermissionGate';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useFiles, useDeleteFile, useAddReservation, useDeleteReservation, useReservations } from '../hooks/useFiles';
import toast from 'react-hot-toast';

export function FilesPage() {
  const { id } = useParams();
  const { data: files = [], isLoading } = useFiles(id);
  const { mutateAsync: deleteFile } = useDeleteFile(id);
  const { data: reservations = [] } = useReservations(id);
  const { mutateAsync: addReservation } = useAddReservation(id);
  const { mutateAsync: deleteReservation } = useDeleteReservation(id);
  const [showReservationForm, setShowReservationForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Files & Reservations" subtitle="Uploaded documents and booking references" />

      {/* File upload */}
      <section>
        <h2 className="font-semibold text-[#1A1A2E] mb-3">Files</h2>
        <PermissionGate require="canUploadFiles">
          <FileUploadZone />
        </PermissionGate>

        {files.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={async (fid) => {
                  await deleteFile(fid);
                  toast.success('File deleted');
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FilesIcon className="w-7 h-7" />}
            title="No files yet"
            description="Upload boarding passes, hotel confirmations, and other documents."
          />
        )}
      </section>

      {/* Reservations */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#1A1A2E]">Reservations</h2>
          <PermissionGate require="canUploadFiles">
            <Button variant="outline" size="sm" onClick={() => setShowReservationForm(true)}>
              <Plus className="w-3.5 h-3.5" /> Add reservation
            </Button>
          </PermissionGate>
        </div>

        {reservations.length > 0 ? (
          <div className="space-y-3">
            {reservations.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onDelete={async (rid) => {
                  await deleteReservation(rid);
                  toast.success('Reservation removed');
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Plus className="w-7 h-7" />}
            title="No reservations yet"
            description="Log hotel stays, flights, and restaurant bookings here."
          />
        )}
      </section>

      <ReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSave={async (reservation) => {
          await addReservation(reservation);
          toast.success('Reservation added');
        }}
      />
    </div>
  );
}
