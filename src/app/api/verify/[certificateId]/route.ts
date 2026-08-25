import { createClient } from '@supabase/supabase-js';
import { json, jsonError } from '@/lib/api';

const CERTIFICATE_ID_PATTERN = /^(?:CF-[A-Z0-9-]{6,40}|CVX-ACADEMY-[A-Z0-9-]{6,40})$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const normalizedId = decodeURIComponent(certificateId || '').trim().toUpperCase();

  if (!CERTIFICATE_ID_PATTERN.test(normalizedId)) {
    return json({ verified: false, status: 'invalid_id', certificateId: normalizedId }, 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ verified: false, status: 'registry_unavailable', certificateId: normalizedId }, 503);
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase
      .from('certificates')
      .select('verification_code, student_name, course_title_en, course_title_ar, issue_date, score, status')
      .eq('verification_code', normalizedId)
      .maybeSingle();

    if (error) return jsonError('Certificate registry lookup failed', 500);
    if (!data || data.status === 'revoked') return json({ verified: false, status: data?.status === 'revoked' ? 'revoked' : 'not_found', certificateId: normalizedId }, 404);

    return json({
      verified: true,
      status: 'valid',
      certificateId: data.verification_code,
      studentName: data.student_name,
      courseTitleEn: data.course_title_en,
      courseTitleAr: data.course_title_ar,
      issueDate: data.issue_date,
      score: data.score,
    });
  } catch {
    return jsonError('Certificate verification failed', 500);
  }
}
