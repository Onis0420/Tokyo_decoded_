import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendContactEmails } from "@/lib/resend";
import type { ApiResult } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  // reCAPTCHA は未導入（クライアントは空文字を送る）。鍵が設定されたときだけ検証する
  recaptchaToken: z.string().optional().default(""),
});

function json<T>(body: ApiResult<T>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON." }, 400);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return json({ success: false, error: "Invalid contact request." }, 400);
  }

  const rateLimit = checkRateLimit("contact", request);
  if (rateLimit.limited) {
    return json(
      { success: false, error: "Too many requests." },
      429,
      { "Retry-After": String(rateLimit.retryAfter) },
    );
  }

  // RECAPTCHA_SECRET_KEY が設定されている環境だけ検証する。
  // 未設定のまま必須にしていたため、公開以来フォームが常に 400/403 で弾かれていた（2026-09-07 修正）。
  if (process.env.RECAPTCHA_SECRET_KEY) {
    const verified = await verifyRecaptcha(parsed.data.recaptchaToken);
    if (!verified) {
      return json({ success: false, error: "reCAPTCHA verification failed." }, 403);
    }
  }

  try {
    await sendContactEmails({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    return json({ success: true }, 200);
  } catch {
    return json({ success: false, error: "Contact request failed." }, 500);
  }
}
