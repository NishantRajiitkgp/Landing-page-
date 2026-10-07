/** The dossier URL now sends people to the live MOHESR screen. */
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/solutions/manpower-and-education-authorities/mohesr`);
}
