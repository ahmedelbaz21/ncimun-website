import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to_name, to_email, week, delegate_id } = await req.json();

    // Create reusable transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Your HTML email template
    const htmlContent = `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px;">
  <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: lightgrey;">
    <p>Hello ${to_name},</p>
    <p>Thank you for registering for <strong>NCIMUN</strong>! Week ${week}. 🎉</p>
    <p>Your Delegate ID is <strong>${delegate_id}</strong>.</p>
    <p>The current registration price is <strong>EGP 2,250</strong>.</p>

    <p>Please note that this is only your <strong>registration confirmation</strong>.
    To officially secure your spot, you must complete the payment as follows <strong>within a week</strong>:</p>

    <p><strong>Payment Options:</strong></p>
    <ul>
      <li><strong>InstaPay</strong> – 01000505097</li>
      <li><strong>Telda</strong> – ahmedelbaz21</li>
    </ul>

    <p>
      After making your payment, kindly <strong>attach the payment proof</strong> in the form linked below:<br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHBXWJZCWI0IkUUI4NCZOrGO4xA8eJjoOijoR0KWnmWiY2AA/viewform?usp=header">
        Payment Confirmation Form
      </a>
    </p>

    <p>⚠️ <strong>Important:</strong> Your registration will only be finalized once we have received and verified your payment proof.
    Until then, your spot is <strong>not officially reserved</strong>.</p>

    <p>⚠️ <strong>Refund Policy:</strong> In case of cancellations, NCIMUN offers a <strong>30% refund</strong>.
    This is because as soon as we receive your payment, we immediately allocate <strong>70%</strong> toward venue,
    logistics, and other conference expenses.</p>

    <p>We look forward to welcoming you to NCIMUN!</p>

    <p>🔗 Stay connected with us on Instagram:
      <a href="https://www.instagram.com/ncimun_tkh?igsh=c2psdjl5djF0MzQ3">NCIMUN's Instagram</a>
    </p>

    <p>For any inquiries, please contact us at:</p>
    <p><strong>ncimun.eg@gmail.com</strong> or:</p>
    <p>01000505097 - Ahmed Elbaz<br>01270709725 - Zeina Marwan</p>

    <p>Best regards,<br><strong>The NCIMUN Team</strong></p>
  </div>
</div>
`;

    // Send the email
    await transporter.sendMail({
      from: `"NCIMUN" <${process.env.GMAIL_USER}>`,
      to: to_email,
      subject: '🎉 NCIMUN Registration Confirmation',
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
