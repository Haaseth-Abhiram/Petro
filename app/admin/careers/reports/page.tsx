import { redirect } from "next/navigation";

export default function RecruitmentReportsPage() {
  // Recruitment reports have been consolidated into Candidate Applications (/admin/careers/applications)
  // where Excel export, PDF export, and the Resume Folder now live.
  redirect("/admin/careers/applications");
}
