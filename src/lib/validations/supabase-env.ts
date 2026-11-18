import { z } from "zod";

const projectUrl = z.url({ protocol: /^https?$/ }).pipe(
  z.string().refine((value) => {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

    return (
      (url.protocol === "https:" || local) &&
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    );
  }),
);

const supabaseEnv = z.object({
  url: projectUrl,
  publishableKey: z.string().regex(/^sb_publishable_[A-Za-z0-9_-]+$/),
});

export function parseSupabaseEnv(values: {
  url?: string;
  publishableKey?: string;
}): z.infer<typeof supabaseEnv> | null {
  const url = values.url?.trim();
  const publishableKey = values.publishableKey?.trim();

  if (!url && !publishableKey) {
    return null;
  }

  const result = supabaseEnv.safeParse({ url, publishableKey });

  if (!result.success) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to a valid project URL and publishable key.",
    );
  }

  return result.data;
}
