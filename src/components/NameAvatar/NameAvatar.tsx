import React from 'react';
import { Avatar, Typography, SxProps, Theme } from '@mui/material';
import { stringToColor } from 'src/helpers';

interface INameAvatar {
  caption: string;
  colored?: boolean;
  sx?: SxProps<Theme>;
  size?: 'small' | 'large';
}

const getAvatarProps = (size?: 'small' | 'large'): SxProps<Theme> | undefined => {
  switch (size) {
    case 'small':
      return {
        width: 32,
        height: 32
      };
    case 'large':
      return {
        width: 56,
        height: 56
      };
    default:
      return undefined;
  }
};

const getTypographyProps = (size?: 'small' | 'large'): SxProps<Theme> | undefined => {
  switch (size) {
    case 'small':
      return {
        fontSize: (theme) => theme.typography.subtitle2.fontSize
      };
    case 'large':
      return {
        fontSize: (theme) => theme.typography.h6.fontSize
      };
    default:
      return undefined;
  }
};

const NameAvatar: React.FC<INameAvatar> = ({ caption, colored, sx, size }) => {
  const initials = caption
    .split(' ')
    .map((name, i) => (i < 2 ? name.trim().charAt(0) : ''))
    .join('');

  return (
    <Avatar
      sx={{
        ...(sx as any),
        ...getAvatarProps(size),
        ...(colored ? { bgcolor: stringToColor(caption) } : undefined)
      }}>
      <Typography sx={getTypographyProps(size)}>{initials}</Typography>
    </Avatar>
  );
};

export default NameAvatar;
