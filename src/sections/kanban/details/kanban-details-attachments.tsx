import { useState, useCallback } from 'react';

import { UploadBox, MultiFilePreview } from 'src/components/upload';

// ----------------------------------------------------------------------

export function KanbanDetailsAttachments({ attachments }: any) {
  const [files, setFiles] = useState(attachments);

  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleRemoveFile = useCallback(
    (inputFile: any) => {
      const filtered = files.filter((file: any) => file !== inputFile);
      setFiles(filtered);
    },
    [files]
  );

  return (
    <MultiFilePreview
      thumbnail
      files={files}
      onRemove={(file: any) => handleRemoveFile(file)}
      slotProps={{ thumbnail: { sx: { width: 64, height: 64 } } }}
      lastNode={<UploadBox onDrop={handleDrop} />}
    />
  );
}
