import { useParams } from 'react-router';
import { REPORT_SECTIONS, type ReportSection, ReportsPanel } from '../reports/shared';

export default function AdminReportsSectionPage() {
  const { section } = useParams<{ section: string }>();
  const valid = (REPORT_SECTIONS as ReadonlyArray<string>).includes(section ?? '')
    ? (section as ReportSection)
    : 'overview';
  return <ReportsPanel section={valid} />;
}
