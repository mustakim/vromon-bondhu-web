import React, { useCallback } from 'react';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface ImagePickerProps {
  onImagesSelected: (files: File[]) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImagesSelected }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onImagesSelected(acceptedFiles);
  }, [onImagesSelected]);

  const { getRootProps, getInputProps }: DropzoneRootProps = useDropzone({ onDrop });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box
        {...getRootProps({
          sx: {
            border: '2px dashed #aaa',
            borderRadius: 4,
            width: '100%',
            cursor: 'pointer',
            padding: '20px',
            textAlign: 'center',
          },
        })}
      >
        <input {...getInputProps()} />
        <Typography variant="body1">
          {"Drag 'n' drop some images here, or click to select files"}
        </Typography>
        <IconButton color="primary" component="span">
          <AddPhotoAlternateIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ImagePicker;
