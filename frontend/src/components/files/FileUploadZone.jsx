import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useUploadFile } from '../../hooks/useFiles';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function FileUploadZone() {
  const { id: tripId } = useParams();
  const { mutateAsync: uploadFile, isPending } = useUploadFile(tripId);

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const f of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', f);
      try {
        await uploadFile(formData);
        toast.success(`"${f.name}" uploaded`);
      } catch {
        toast.error(`Failed to upload "${f.name}"`);
      }
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-[#E94560] bg-[#E94560]/5'
          : 'border-[#E0E0E0] bg-[#F8F9FA] hover:border-[#E94560]/50 hover:bg-[#E94560]/5'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragActive ? 'text-[#E94560]' : 'text-[#6B7280]'}`} />
      <p className="text-sm font-medium text-[#1A1A2E]">
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </p>
      <p className="text-xs text-[#6B7280] mt-1">{isPending ? 'Uploading...' : 'or click to browse · PDF, images, docs · max 10MB'}</p>
    </div>
  );
}
