import { NextRequest, NextResponse } from "next/server";
import { getSmtpConfigFromEnv, sendMail } from "@/lib/smtp";

// Route Handlers run on the Node.js runtime by default, which is required
// here since `node:net` / `node:tls` aren't available on the Edge runtime.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 5000,
};

// Soft, in-memory rate limit. Resets whenever the serverless instance
// recycles — good enough to discourage casual abuse without any paid
// service or database.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  /** Honeypot field — real users never fill this in. */
  company?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages sent recently. Please try again later." },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  const honeypot = (body.company ?? "").trim();

  // Bots that fill in the hidden field get a fake success — no point
  // telling them anything useful.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    subject.length > MAX_LENGTHS.subject ||
    message.length > MAX_LENGTHS.message
  ) {
    return NextResponse.json({ ok: false, error: "One or more fields are too long." }, { status: 400 });
  }

  let config;
  try {
    config = getSmtpConfigFromEnv();
  } catch {
    console.error("Contact form: SMTP environment variables are not configured.");
    return NextResponse.json(
      { ok: false, error: "Email isn't configured on this site yet." },
      { status: 500 }
    );
  }

  const toAddress = process.env.CONTACT_TO_EMAIL || config.user;

  try {
    await sendMail(config, {
      to: toAddress,
      from: config.user,
      fromName: "Portfolio Contact Form",
      replyTo: `"${name.replace(/[\r\n"]+/g, " ")}" <${email}>`,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      text: [
        `New message from the portfolio contact form.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        ``,
        message,
        ``,
        `— sent from the contact form at ${request.headers.get("origin") ?? "unknown origin"}`,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  } catch (error) {
    console.error("Contact form: failed to send email.", error);
    return NextResponse.json(
      { ok: false, error: "Couldn't send your message right now. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
