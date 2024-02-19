import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface DeleteButtonProps {
  messageId: string;
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ messageId, onDelete }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this message?');
    if (confirmDelete) {
      setLoading(true);
      try {
        await axios.delete(`/api/issue/${messageId}`);
        onDelete();
      } catch (error) {
        console.error('Error deleting message:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Tooltip title="Delete">
      <IconButton onClick={handleDeleteClick} disabled={loading}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteButton;
