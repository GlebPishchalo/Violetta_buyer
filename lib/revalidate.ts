import { revalidatePath } from "next/cache";

export function revalidatePublicReviews() {
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidatePath("/ru/reviews");
  revalidatePath("/en/reviews");
  revalidatePath("/ru");
  revalidatePath("/en");
}

export function revalidatePublicCatalog() {
  revalidatePath("/admin/catalog");
  revalidatePath("/admin");
  revalidatePath("/ru/catalog");
  revalidatePath("/en/catalog");
  revalidatePath("/ru");
  revalidatePath("/en");
}

export function revalidatePublicContent() {
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  revalidatePath("/ru");
  revalidatePath("/en");
  revalidatePath("/ru/services");
  revalidatePath("/en/services");
}

export function revalidatePublicFlights() {
  revalidatePath("/admin/flights");
  revalidatePath("/admin");
  revalidatePath("/ru/services");
  revalidatePath("/en/services");
}
