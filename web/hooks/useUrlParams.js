import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (changes, { resetPage = true } = {}) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(changes).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    if (resetPage) params.delete("page");
    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname));
  };

  return { searchParams, update, isPending };
}