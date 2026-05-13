export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let ping: string;
  try {
    const res = await fetch(`${url}/auth/v1/health`);
    ping = `${res.status} ${res.statusText}`;
  } catch (e) {
    ping = e instanceof Error ? e.message : String(e);
  }

  return Response.json({
    url: url ?? "MISSING",
    keyPresent: !!key,
    keyPrefix: key ? key.slice(0, 20) + "..." : "MISSING",
    ping,
  });
}
