import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteButtonProps {
  onDelete: () => void; // Function to handle delete action
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  const handleDeleteClick = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this?');
    if (confirmDelete) {
      onDelete(); // Call the onDelete function passed from the parent component
    }
  };

  return (
    <Tooltip title="Delete">
      <IconButton onClick={handleDeleteClick}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteButton;
