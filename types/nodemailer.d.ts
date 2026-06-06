// Minimal ambient declaration for the small surface of nodemailer we use in
// app/api/subscribe/lead. Avoids pulling @types/nodemailer (pnpm repo) for a
// single optional code path.
declare module "nodemailer" {
  interface MailOptions {
    from?: string
    to?: string
    subject?: string
    text?: string
    html?: string
  }
  interface TransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: { user?: string; pass?: string }
  }
  interface Transporter {
    sendMail(mail: MailOptions): Promise<unknown>
  }
  function createTransport(opts: TransportOptions): Transporter
  const nodemailer: { createTransport: typeof createTransport }
  export default nodemailer
}
