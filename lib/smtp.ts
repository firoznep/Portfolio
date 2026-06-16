/**
 * Minimal SMTP client built directly on Node's built-in `net` and `tls`
 * modules — no nodemailer, no third-party email API. Designed to work
 * with a free SMTP relay such as Gmail (smtp.gmail.com + an App Password).
 *
 * Supports both:
 *  - STARTTLS (e.g. port 587): plaintext `net` connection upgraded to TLS
 *  - Implicit TLS (e.g. port 465): `tls` connection from the start
 *
 * Configuration is read entirely from environment variables — see
 * .env.example for the full list.
 */
import { connect as netConnect, type Socket } from "node:net";
import { connect as tlsConnect, type TLSSocket } from "node:tls";

const CRLF = "\r\n";
const RESPONSE_TIMEOUT_MS = 12_000;
const SOCKET_TIMEOUT_MS = 20_000;

export interface SmtpConfig {
  host: string;
  port: number;
  /** true = implicit TLS from connect (e.g. port 465). false = STARTTLS (e.g. port 587). */
  secure: boolean;
  user: string;
  pass: string;
  /** Domain announced in EHLO. Doesn't need to be publicly resolvable. */
  ehloDomain: string;
}

export interface ContactMessage {
  to: string;
  from: string;
  fromName: string;
  replyTo: string;
  subject: string;
  text: string;
}

interface SmtpResponse {
  code: number;
  lines: string[];
}

class SmtpError extends Error {
  constructor(context: string, response: SmtpResponse) {
    super(`SMTP error during ${context}: ${response.code} ${response.lines.join(" ")}`);
    this.name = "SmtpError";
  }
}

/** Reads the next complete (possibly multi-line) SMTP response. */
function readResponse(socket: Socket): Promise<SmtpResponse> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for SMTP server response"));
    }, RESPONSE_TIMEOUT_MS);

    function onData(chunk: Buffer) {
      buffer += chunk.toString("utf8");
      if (!buffer.endsWith(CRLF)) return;

      const lines = buffer.slice(0, -2).split(CRLF);
      const last = lines[lines.length - 1];

      // Final line of a response is "DDD <text>" (space). Continuation
      // lines in a multi-line response use "DDD-<text>" (hyphen).
      if (/^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), lines });
      }
    }

    function onError(err: Error) {
      cleanup();
      reject(err);
    }

    function cleanup() {
      clearTimeout(timer);
      socket.off("data", onData);
      socket.off("error", onError);
    }

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

/** Sends a single CRLF-terminated command and waits for the response. */
function sendCommand(socket: Socket, command: string): Promise<SmtpResponse> {
  const pending = readResponse(socket);
  socket.write(command + CRLF);
  return pending;
}

function expectCode(response: SmtpResponse, codes: number[], context: string) {
  if (!codes.includes(response.code)) {
    throw new SmtpError(context, response);
  }
}

function connectSocket(config: SmtpConfig): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const onError = (err: Error) => reject(err);

    const socket = config.secure
      ? tlsConnect({ host: config.host, port: config.port, servername: config.host })
      : netConnect({ host: config.host, port: config.port });

    socket.setTimeout(SOCKET_TIMEOUT_MS, () => {
      socket.destroy(new Error("SMTP connection timed out"));
    });

    socket.once("error", onError);
    socket.once(config.secure ? "secureConnect" : "connect", () => {
      socket.off("error", onError);
      resolve(socket);
    });
  });
}

/** Upgrades an existing plaintext socket to TLS in place (STARTTLS). */
function upgradeToTls(socket: Socket, servername: string): Promise<TLSSocket> {
  return new Promise((resolve, reject) => {
    socket.removeAllListeners("data");
    socket.removeAllListeners("error");

    const tlsSocket = tlsConnect({ socket, servername });
    tlsSocket.once("error", reject);
    tlsSocket.once("secureConnect", () => resolve(tlsSocket));
  });
}

/** Connects, negotiates TLS if needed, and authenticates. Returns the active socket. */
async function openAuthenticatedSession(config: SmtpConfig): Promise<Socket> {
  let socket: Socket = await connectSocket(config);

  const greeting = await readResponse(socket);
  expectCode(greeting, [220], "server greeting");

  let ehlo = await sendCommand(socket, `EHLO ${config.ehloDomain}`);
  expectCode(ehlo, [250], "EHLO");

  if (!config.secure) {
    const starttls = await sendCommand(socket, "STARTTLS");
    expectCode(starttls, [220], "STARTTLS");

    socket = await upgradeToTls(socket, config.host);

    ehlo = await sendCommand(socket, `EHLO ${config.ehloDomain}`);
    expectCode(ehlo, [250], "EHLO after STARTTLS");
  }

  const authStart = await sendCommand(socket, "AUTH LOGIN");
  expectCode(authStart, [334], "AUTH LOGIN");

  const userPrompt = await sendCommand(socket, Buffer.from(config.user, "utf8").toString("base64"));
  expectCode(userPrompt, [334], "AUTH LOGIN (username)");

  const passResult = await sendCommand(socket, Buffer.from(config.pass, "utf8").toString("base64"));
  expectCode(passResult, [235], "AUTH LOGIN (password)");

  return socket;
}

/** Converts text into a dot-stuffed, CRLF-terminated SMTP DATA payload. */
function encodeBody(text: string): string {
  const lines = text.split(/\r\n|\r|\n/).map((line) => (line.startsWith(".") ? "." + line : line));
  return lines.join(CRLF) + CRLF;
}

/** Strips header-injection characters from a value used inside a header line. */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildMessage(message: ContactMessage): string {
  const headers = [
    `From: "${sanitizeHeaderValue(message.fromName)}" <${message.from}>`,
    `To: <${message.to}>`,
    `Reply-To: ${sanitizeHeaderValue(message.replyTo)}`,
    `Subject: ${sanitizeHeaderValue(message.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "X-Mailer: portfolio-contact-form (node:net/tls)",
  ];

  return headers.join(CRLF) + CRLF + CRLF + encodeBody(message.text);
}

export function getSmtpConfigFromEnv(): SmtpConfig {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS environment variables are required");
  }

  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    user,
    pass,
    ehloDomain: process.env.SMTP_EHLO_DOMAIN || "localhost",
  };
}

/** Sends a single plain-text email through the configured SMTP relay. */
export async function sendMail(config: SmtpConfig, message: ContactMessage): Promise<void> {
  const socket = await openAuthenticatedSession(config);

  try {
    const mailFrom = await sendCommand(socket, `MAIL FROM:<${message.from}>`);
    expectCode(mailFrom, [250], "MAIL FROM");

    const rcptTo = await sendCommand(socket, `RCPT TO:<${message.to}>`);
    expectCode(rcptTo, [250, 251], "RCPT TO");

    const dataStart = await sendCommand(socket, "DATA");
    expectCode(dataStart, [354], "DATA");

    const payload = buildMessage(message);
    const dataEnd = await sendCommand(socket, payload + ".");
    expectCode(dataEnd, [250], "message body");

    await sendCommand(socket, "QUIT");
  } finally {
    socket.end();
    socket.destroy();
  }
}
