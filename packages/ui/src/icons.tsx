import type { ReactNode, SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  /**
   * Override the default 1.75 stroke. Use 2 for tighter, denser contexts.
   */
  strokeWidth?: number;
}

function Icon({
  size = 20,
  strokeWidth = 1.75,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------- */
/* Navigation                                                           */
/* -------------------------------------------------------------------- */

export function LayoutDashboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icon>
  );
}

export function BanknoteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.25" />
      <path d="M6 12h.01M18 12h.01" />
    </Icon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 21.7a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z" />
      <path d="m21.85 2.15-10.94 10.94" />
    </Icon>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 2.5v19l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1v-19l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M16 8.5h-5.5a2 2 0 1 0 0 4h3a2 2 0 1 1 0 4H8" />
      <path d="M12 6.5v11" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </Icon>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 21H6a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 6 3h3.5" />
      <path d="m16 16.5 4.5-4.5L16 7.5" />
      <path d="M20.5 12H9.5" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 20.5v-1.5a4.5 4.5 0 0 0-4.5-4.5H9a4.5 4.5 0 0 0-4.5 4.5v1.5" />
      <circle cx="12" cy="7.5" r="3.75" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15" />
      <path d="m13 5.5 6.5 6.5-6.5 6.5" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 12h-15" />
      <path d="M11 5.5 4.5 12l6.5 6.5" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </Icon>
  );
}

export function ArrowDownLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 7 7 17" />
      <path d="M17 17H8.5V8.5" />
    </Icon>
  );
}

export function ArrowDownToLineIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5v11" />
      <path d="m7.5 10 4.5 4.5L16.5 10" />
      <path d="M4.5 20.5h15" />
    </Icon>
  );
}

/* -------------------------------------------------------------------- */
/* Actions                                                               */
/* -------------------------------------------------------------------- */

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 5 5 9-11" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8.25 12.25 2.75 2.75 5-5.5" />
    </Icon>
  );
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 7.75v5" />
      <path d="M12 16.25h.01" />
    </Icon>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.3 3.6 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0" />
      <path d="M12 9v4.5" />
      <path d="M12 17.5h.01" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 16.25V11.5" />
      <path d="M12 7.75h.01" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2.25" />
      <path d="M5.5 15H4.75A1.75 1.75 0 0 1 3 13.25v-8.5C3 3.78 3.78 3 4.75 3h8.5C14.22 3 15 3.78 15 4.75v.75" />
    </Icon>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 3.5H20.5v6" />
      <path d="M10.5 13.5 20.5 3.5" />
      <path d="M18.5 13.75v5.25a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h5.25" />
    </Icon>
  );
}

export function RefreshCwIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9L20.5 8.5" />
      <path d="M20.5 3.5v5h-5" />
      <path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.5" />
      <path d="M3.5 20.5v-5h5" />
    </Icon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.2 12.3a.9.9 0 0 1 0-.6 10.4 10.4 0 0 1 19.6 0 .9.9 0 0 1 0 .6 10.4 10.4 0 0 1-19.6 0" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.7 5.2A10.3 10.3 0 0 1 21.8 12.3a.9.9 0 0 1 0 .6 10.3 10.3 0 0 1-1.5 2.5" />
      <path d="M14.1 14.2a3 3 0 0 1-4.2-4.3" />
      <path d="M17.5 17.5A10.3 10.3 0 0 1 2.2 12.3a.9.9 0 0 1 0-.6 10.3 10.3 0 0 1 4.4-5.1" />
      <path d="m2.5 2.5 19 19" />
    </Icon>
  );
}

/* -------------------------------------------------------------------- */
/* Domain + marketing                                                    */
/* -------------------------------------------------------------------- */

export function WalletIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 8V5.5a1.5 1.5 0 0 0-1.5-1.5h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V16" />
      <path d="M21 8.5h-4.25a2.75 2.75 0 0 0 0 5.5H21z" />
    </Icon>
  );
}

export function LandmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11.1 2.7a1.5 1.5 0 0 1 1.3 0l7.9 3.6a.6.6 0 0 1-.2 1.1H4a.6.6 0 0 1-.2-1.1z" />
      <path d="M6 11.5v6M10 11.5v6M14 11.5v6M18 11.5v6" />
      <path d="M3 21h18" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 6.75V12l3.5 2" />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 12.5c0 4.6-3.2 6.9-7.1 8.2a1.2 1.2 0 0 1-.8 0C7.7 19.4 4.5 17.1 4.5 12.5V6a1 1 0 0 1 1-1c1.9 0 4.2-1.1 5.8-2.5a1.1 1.1 0 0 1 1.4 0C14.3 3.9 16.6 5 18.5 5a1 1 0 0 1 1 1z" />
      <path d="m9.25 12 2.25 2.25L15 10.5" />
    </Icon>
  );
}

export function ZapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 13.5a1 1 0 0 1-.8-1.6l9.6-10.2a.5.5 0 0 1 .9.45L11.8 8a1 1 0 0 0 .87 1.4h7.5a1 1 0 0 1 .8 1.6l-9.6 10.2a.5.5 0 0 1-.9-.45L12.2 15a1 1 0 0 0-.87-1.4z" />
    </Icon>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.5 3.6 11.9 8 16.3 9.4 11.9 10.8 10.5 15.2 9.1 10.8 4.7 9.4 9.1 8z" />
      <path d="M17.5 14.2 18.3 16.6 20.7 17.4 18.3 18.2 17.5 20.6 16.7 18.2 14.3 17.4 16.7 16.6z" />
    </Icon>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.5 16.5 5.5-5.5 3.5 3.5 6-6.5" />
      <path d="M15 8h4v4" />
    </Icon>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21.5 12.5h-4l-1.5 2.5h-8L6.5 12.5h-4" />
      <path d="M5.7 5.4 2.5 12.5v4a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-4l-3.2-7.1a2 2 0 0 0-1.8-1.2H7.5a2 2 0 0 0-1.8 1.2" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4-4" />
    </Icon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="10.5" width="17" height="10" rx="2.25" />
      <path d="M7.5 10.5v-4a4.5 4.5 0 0 1 9 0v4" />
    </Icon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 20.5v-7a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v7" />
      <path d="M3.5 9.9 12 3l8.5 6.9v9.1a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z" />
    </Icon>
  );
}