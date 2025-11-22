import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const AvatarUploader = ({ imageUrl, onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]); // Pass file to parent
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div {...getRootProps()} className="flex flex-col items-center cursor-pointer">
      <input {...getInputProps()} />

      <label className="text-sm text-gray-700 font-medium mb-2">Avatar:</label>

      <img
        src={imageUrl}
        alt="avatar"
        className="h-[110px] w-[110px] rounded-full object-cover border shadow"
      />

      <p className="text-xs text-gray-400 mt-1">Click to change</p>
    </div>
  );
};

export default AvatarUploader;



/*
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const AvatarUploader = ({ imageUrl, onFieldChange, setFiles }) => {
    const convertFileToUrl = file => URL.createObjectURL(file);
    const handleDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles);
        onFieldChange('avatar', convertFileToUrl(acceptedFiles[0]));

    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    })

  return (
    <div {...getRootProps()} className="flex flex-col justify-center items-center gap-4 cursor-pointer">
        <input
          id="avatar"
          type="file"
          accept="image/*"
          {...getInputProps() }
          className="mt-1 block w-full text-sm"
        />
        <img
          src={imageUrl}
          alt="avatar"
          className="h-[110px] w-[110px] rounded-full object-cover border shadow"
        />
        <label className="text-sm text-gray-700 font-normal">Avatar</label>
    </div>
      
  )
}

export default AvatarUploader

*/