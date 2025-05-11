import { useTheme } from '@mui/material';
import { Box, Button, Divider, Modal, Stack, styled, Typography } from '@mui/material';
import React, { RefObject, useState } from 'react';
import { toast } from 'src/components/snackbar';
import { initEmployeeState } from 'src/redux/employee/employees.slice';
import { useAppDispatch } from 'src/redux/store';
import {
  getEmployeesWithDepartmentsAsync,
  importCsvFileAsync,
  importExcelFileAsync,
} from 'src/services/employee/employee.service';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

function FilesImport({
  open,
  filetype,
  cancel,
}: {
  open: boolean;
  filetype: string;
  cancel: () => void;
}) {
  const theme = useTheme();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const dispatch = useAppDispatch();
  const fileType = filetype;

  const inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();

  const handleCloseModal = () => {
    setFiles(null);
    if (inputOpenFileRef.current) {
      inputOpenFileRef.current.value = '';
    }
    cancel();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && validateFiles(droppedFiles)) {
      setFiles(droppedFiles);
    }
  };
  const handleFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files) {
      let response;
      if (filetype === 'text/csv') {
        response = await dispatch(importCsvFileAsync(files[0]));
      } else if (filetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        response = await dispatch(importExcelFileAsync(files[0]));
      }

      if (response?.meta.requestStatus === 'fulfilled') {
        toast.success('File uploaded successfully');
        dispatch(getEmployeesWithDepartmentsAsync(initEmployeeState.employeeFilterString));
        handleCloseModal();
      } else {
        toast.error('File upload failed');
      }

      // Reset the input value after successful upload
      if (inputOpenFileRef.current) {
        inputOpenFileRef.current.value = '';
      }
    }
  };

  const validateFiles = (fileList: FileList) => {
    const acceptedTypes = [fileType]; // specify allowed types here
    for (let i = 0; i < fileList.length; i++) {
      if (!acceptedTypes.includes(fileList[i].type)) {
        toast.error(`Invalid file type File type not accepted: ${fileList[i].name}`);
        return false;
      }
    }
    return true;
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={handleFiles} name="importFile">
        <Box
          sx={{
            my: '20%',
            mx: 'auto',
            p: 2,
            width: '20%',
            height: 'auto',
            bgcolor:  (theme.palette.mode === 'dark' ? '#263238' : '#eeeeee'),
            borderRadius: '8px',
          }}
        >
          <Stack
            sx={{
              gap: 2,
              mt: 2,
            }}
          >
            {/* Drag and Drop Area */}
            <Box
              sx={{
                border: dragging ? '2px dashed #1976d2' : '2px dashed #cccccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: dragging ? '#e3f2fd' : '#fafafa',
                cursor: 'pointer',
                width: '100%',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputOpenFileRef.current?.click()}
            >
              {files ? (
                <Typography
                sx={{
                  color: (theme.palette.mode === 'dark' ? '#212121' : '#212121')
                }}
                >{`${files[0].name} file selected`}</Typography>
              ) : (
                <Typography
                sx={{
                  color: (theme.palette.mode === 'dark' ? '#212121' : '#212121')
                }}
                >Drag and drop file here or click to upload</Typography>
              )}
              <VisuallyHiddenInput
                type="file"
                ref={inputOpenFileRef}
                accept={fileType} // specify allowed file types here
                onChange={(event) => {
                  const selectedFiles = event.target.files;
                  if (selectedFiles && validateFiles(selectedFiles)) {
                    setFiles(selectedFiles);
                  }
                }}
                multiple
              />
            </Box>

            <Divider
              sx={{
                width: '100%',
                backgroundColor: '#e0e0e0',
              }}
            />
            <Button variant="contained" color="primary" type="submit" disabled={!files}>
              Save
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
}

export default FilesImport;
