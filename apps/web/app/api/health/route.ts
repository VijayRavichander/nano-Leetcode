export async function GET() {
  return new Response("Health Check", { status: 200 });
}
