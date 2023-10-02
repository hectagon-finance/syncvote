/* eslint-disable max-len */
import React from 'react';

interface Props {
  color?: string;
  className?: string;
}

const AngleRightIcon: React.FC<Props> = ({ color = '#898988', className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 256 512"
  >
    <path
      fill={color}
      d="M246.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 41.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
    />
  </svg>
);

export default AngleRightIcon;
