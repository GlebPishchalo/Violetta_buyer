import { redirect } from "next/navigation";

/** Root redirects to default locale. Public pages live under /[locale]. */
export default function RootPage() {
  redirect("/ru");
}
