export type IconName =
  | 'home'
  | 'users'
  | 'calendar'
  | 'report'
  | 'settings'
  | 'alert'
  | 'menu'
  | 'close'
  | 'search'
  | 'chevron-right'
  | 'check'
  | 'info';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const paths: Record<IconName, JSX.Element> = {
  home: (
    <path
      d="M3 11.25 12 3l9 8.25M19.5 10.5V20a.75.75 0 0 1-.75.75H14.25a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V20a.75.75 0 0 1-.75.75H5.25A.75.75 0 0 1 4.5 20v-9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  users: (
    <path
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm-11.5 12a5.75 5.75 0 0 1 11.5 0v.25a.75.75 0 0 1-.75.75h-10a.75.75 0 0 1-.75-.75Z"
      strokeLinecap="round"
    />
  ),
  calendar: (
    <path
      d="M7.5 3.75v2.5m9-2.5v2.5m-12 3.5h15m-12.75-6h10.5A1.75 1.75 0 0 1 21 5.5v11.75A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V5.5A1.75 1.75 0 0 1 4.75 4h.25Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  report: (
    <path
      d="M8.25 4.5h7.5a2.25 2.25 0 0 1 2.25 2.25v12a.75.75 0 0 1-.75.75h-10.5a.75.75 0 0 1-.75-.75v-12A2.25 2.25 0 0 1 8.25 4.5Zm0 0V3.75A.75.75 0 0 1 9 3h6a.75.75 0 0 1 .75.75V4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  settings: (
    <path
      d="M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-7.5 2.25h3.023m7.954 0H19.5m-9.75 7.5V16.5m0-9.75V4.5m4.5 0v2.25m0 9.75V19.5m-9 0H6.75m10.5 0H19.5m-12-15H4.5m12 0h2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  alert: (
    <path
      d="M12 9v3.75m0 3.75h.008v-.008H12Zm8.25 0a.75.75 0 0 1-.65 1.125H4.4a.75.75 0 0 1-.65-1.125l7.6-13.5a.75.75 0 0 1 1.3 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  menu: (
    <path d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" strokeLinecap="round" />
  ),
  close: <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />,
  search: (
    <path
      d="m15.75 15.75 3 3m-1.5-7.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'chevron-right': <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="m6 12 3 3 9-9" strokeLinecap="round" strokeLinejoin="round" />,
  info: (
    <path
      d="M12 8.25h.008v.008H12Zm0 3v4.5m8.25-4.5a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6, className }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      fill="none"
      strokeWidth={strokeWidth}
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
