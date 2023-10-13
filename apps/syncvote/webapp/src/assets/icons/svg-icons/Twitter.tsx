type Props = {
  width?: string;
  height?: string;
};

function Twitter(props: Props) {
  const { width = '24', height = '24' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.54752 22.2503C16.6042 22.2503 21.5578 14.7469 21.5578 8.24003C21.5578 8.02691 21.5578 7.81475 21.5434 7.60355C22.507 6.90651 23.3389 6.04344 24 5.05475C23.1014 5.45315 22.148 5.71431 21.1718 5.82947C22.1998 5.21416 22.9692 4.24625 23.3366 3.10595C22.3701 3.67956 21.3126 4.08378 20.2099 4.30115C19.4675 3.51173 18.4856 2.98899 17.4162 2.81384C16.3468 2.63868 15.2494 2.82087 14.294 3.3322C13.3385 3.84354 12.5782 4.65553 12.1307 5.6425C11.6833 6.62947 11.5735 7.73642 11.8186 8.79203C9.8609 8.69383 7.94576 8.18506 6.19745 7.29876C4.44915 6.41245 2.90676 5.16841 1.6704 3.64739C1.04073 4.73139 0.847872 6.01462 1.1311 7.23581C1.41433 8.45701 2.15234 9.52435 3.19488 10.2205C2.41123 10.1976 1.64465 9.98615 0.96 9.60419V9.66659C0.960311 10.8034 1.35385 11.9052 2.07387 12.785C2.79389 13.6647 3.79606 14.2684 4.9104 14.4935C4.18548 14.6912 3.42487 14.7201 2.68704 14.578C3.00181 15.5563 3.61443 16.4118 4.43924 17.0249C5.26405 17.638 6.25983 17.978 7.28736 17.9975C6.26644 18.7999 5.09731 19.3933 3.84687 19.7435C2.59643 20.0937 1.28921 20.1939 0 20.0384C2.25183 21.4834 4.87192 22.2499 7.54752 22.2464"
        fill="#1DA1F2"
      />
    </svg>
  );
}

export default Twitter;
