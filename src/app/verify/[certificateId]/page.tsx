import { PublicCertificateVerification } from '@/components/PublicCertificateVerification';

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  return <PublicCertificateVerification certificateId={certificateId} />;
}
