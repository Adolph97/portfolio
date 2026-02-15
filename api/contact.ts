import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripWrappingQuotes = (value?: string) => value?.replace(/^"(.*)"$/, '$1').trim();

  // 2. Validate Environment Variables
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('CRITICAL: Missing Environment Variables:', missingEnvVars);
    return res.status(500).json({ 
      error: 'Server configuration error', 
      details: `Missing: ${missingEnvVars.join(', ')}. Ensure these are set in Vercel settings.` 
    });
  }

  const { name, email, message } = req.body;

  // 3. Request body validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields (name, email, or message)' });
  }

  // 4. Normalize SMTP config and configure transporter
  const requestedHost = stripWrappingQuotes(process.env.SMTP_HOST)?.toLowerCase();
  const smtpHost = requestedHost === 'smtp.google.com' ? 'smtp.gmail.com' : requestedHost;
  const smtpPort = parseInt(stripWrappingQuotes(process.env.SMTP_PORT) || '587', 10);
  const smtpSecure = stripWrappingQuotes(process.env.SMTP_SECURE) === 'true' || smtpPort === 465;
  const smtpUser = stripWrappingQuotes(process.env.SMTP_USER);
  const rawPass = stripWrappingQuotes(process.env.SMTP_PASS);

  // Gmail app passwords are often copied with spaces; normalize safely for Gmail hosts.
  const smtpPass = smtpHost?.includes('gmail') ? rawPass?.replace(/\s+/g, '') : rawPass;

  if (!smtpHost || !smtpUser || !smtpPass || Number.isNaN(smtpPort)) {
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'SMTP config is invalid. Check host/port/user/pass values.',
    });
  }

  // Note: For Gmail, use port 587 and secure: false (STARTTLS)
  // or port 465 and secure: true (SSL/TLS)
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure, 
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Adding a timeout to prevent function from hanging
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  try {
    // 5. Verify connection configuration
    console.log(`Attempting to verify SMTP connection to ${smtpHost}:${smtpPort} (secure=${smtpSecure})...`);
    await transporter.verify();
    console.log('SMTP Connection verified successfully');

    // 6. Send Mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: stripWrappingQuotes(process.env.CONTACT_EMAIL) || smtpUser,
      subject: `[Portfolio] Mission Brief from ${name}`,
      text: message,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">New Mission Brief Received</h2>
          <hr />
          <p><strong>Sender:</strong> ${name}</p>
          <p><strong>Return Route:</strong> ${email}</p>
          <br/>
          <p><strong>Parameters:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap;">
${message}
          </div>
          <p style="font-size: 11px; color: #999; margin-top: 30px;">
            System Transmission ID: ${Date.now()}
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully');
    return res.status(200).json({ success: true, message: 'Transmission successful' });
  } catch (error: any) {
    // 7. Detailed Error Logging
    console.error('NODEMAILER ERROR:', error);
    
    let message = 'Failed to broadcast transmission';
    if (error.code === 'EAUTH') message = 'SMTP Authentication failed. Check your user/password (or App Password).';
    if (error.code === 'ECONNREFUSED') message = 'Could not connect to SMTP server. Check host and port.';
    if (error.code === 'ETIMEDOUT') message = 'SMTP connection timed out. Host, port, secure mode, or network/firewall is blocking the connection.';
    
    return res.status(500).json({ 
      error: message, 
      code: error.code,
      details: error.message 
    });
  }
}
