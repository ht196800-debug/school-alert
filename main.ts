import { serve } from "https://deno.land/std/http/server.ts";

serve(() => {
  return new Response("School Alert is running! 🚨", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});
