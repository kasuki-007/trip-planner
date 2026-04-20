import { FileText, Image, File, Download, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../utils/getInitials';
import { formatDate } from '../../utils/formatDate';
import { PermissionGate } from '../trip/PermissionGate';

const typeIconMap = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  image: <Image className="w-5 h-5 text-sky-500" />,
};


export function FileCard({ file, onDelete }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl border border-[#E0E0E0] hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
        {typeIconMap[file.type] ?? <File className="w-5 h-5 text-[#6B7280]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A2E] truncate">{file.name}</p>
        <p className="text-xs text-[#6B7280]">{formatFileSize(file.size)} · {formatDate(file.uploadedAt, 'MMM d, yyyy')}</p>
      </div>
      <a
        href={`/api/v1/trips/${file.tripId}/files/${file.id}/download`}
        download={file.name}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6B7280] hover:text-[#1A1A2E] hover:bg-white transition-all"
        aria-label="Download file"
      >
        <Download className="w-4 h-4" />
      </a>
      <PermissionGate require="canUploadFiles">
        <button
          onClick={() => onDelete?.(file.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-all"
          aria-label="Delete file"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </PermissionGate>
    </div>
  );
}
