import { Badge } from '@/components/ui/Badge';
import type { AlbumStatus, PaymentStatus, PurchaseStatus, PhotoProcessingStatus } from '@/types';
import type { ComponentProps } from 'react';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

// ─── AlbumStatus ─────────────────────────────────────────────
function AlbumStatusBadge({ status }: { status: AlbumStatus }) {
  const map: Record<AlbumStatus, { label: string; variant: BadgeVariant }> = {
    DRAFT:     { label: 'Draft',     variant: 'default' },
    PUBLISHED: { label: 'Published', variant: 'info' },
    COMPLETED: { label: 'Completed', variant: 'success' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

// ─── PaymentStatus ───────────────────────────────────────────
function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
    PENDING:        { label: 'Pending',        variant: 'warning' },
    PROOF_UPLOADED: { label: 'Proof Uploaded', variant: 'info' },
    PAID:           { label: 'Paid',           variant: 'success' },
    REJECTED:       { label: 'Rejected',       variant: 'destructive' },
    EXPIRED:        { label: 'Expired',        variant: 'default' },
    FAILED:         { label: 'Failed',         variant: 'destructive' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

// ─── PurchaseStatus ──────────────────────────────────────────
function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  const map: Record<PurchaseStatus, { label: string; variant: BadgeVariant }> = {
    PENDING:   { label: 'Pending',   variant: 'warning' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'default' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

// ─── PhotoProcessingStatus ────────────────────────────────────
function PhotoProcessingStatusBadge({ status }: { status: PhotoProcessingStatus }) {
  const map: Record<PhotoProcessingStatus, { label: string; variant: BadgeVariant; animate?: boolean }> = {
    UPLOADED:   { label: 'Uploaded',   variant: 'default' },
    PROCESSING: { label: 'Processing', variant: 'info',    animate: true },
    READY:      { label: 'Ready',      variant: 'success' },
    FAILED:     { label: 'Failed',     variant: 'destructive' },
  };
  const { label, variant, animate } = map[status] ?? { label: status, variant: 'default' };
  return (
    <Badge variant={variant} size="sm" className={animate ? 'animate-pulse' : undefined}>
      {label}
    </Badge>
  );
}

// ─── Composite StatusBadge ───────────────────────────────────
type StatusBadgeProps =
  | { type: 'album';    status: AlbumStatus }
  | { type: 'payment';  status: PaymentStatus }
  | { type: 'purchase'; status: PurchaseStatus }
  | { type: 'photo';    status: PhotoProcessingStatus };

function StatusBadge(props: StatusBadgeProps) {
  switch (props.type) {
    case 'album':    return <AlbumStatusBadge   status={props.status} />;
    case 'payment':  return <PaymentStatusBadge  status={props.status} />;
    case 'purchase': return <PurchaseStatusBadge status={props.status} />;
    case 'photo':    return <PhotoProcessingStatusBadge status={props.status} />;
  }
}

export {
  StatusBadge,
  AlbumStatusBadge,
  PaymentStatusBadge,
  PurchaseStatusBadge,
  PhotoProcessingStatusBadge,
};
