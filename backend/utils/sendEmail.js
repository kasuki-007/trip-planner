const nodemailer = require('nodemailer');

let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_gmail@gmail.com') {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('\n?? Ethereal test email active. View sent emails at https://ethereal.email');
    console.log('   Login with:', testAccount.user, '/', testAccount.pass, '\n');
  }

  return _transporter;
}

async function sendInviteEmail({ to, inviteeName, inviterName, tripTitle, role, tripUrl }) {
  const transporter = await getTransporter();
  const subject = `${inviterName} invited you to "${tripTitle}" on TripSync`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: #1A1A2E; padding: 24px; text-align: center;">
        <h1 style="color: #E94560; margin: 0; font-size: 28px;">? TripSync</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1A1A2E; margin-top: 0;">You've been invited!</h2>
        <p style="color: #444; line-height: 1.6;">
          Hi ${inviteeName},<br/><br/>
          <strong>${inviterName}</strong> has invited you to join the trip
          <strong>"${tripTitle}"</strong> as a <strong>${role}</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${tripUrl}" style="background: #E94560; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            View Trip
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">
          If you don't have a TripSync account yet,
          <a href="${process.env.CLIENT_URL}/register" style="color: #E94560;">sign up here</a>
          using this email address to access the trip.
        </p>
      </div>
      <div style="background: #F8F9FA; padding: 16px; text-align: center;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">TripSync � Plan trips together</p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_gmail@gmail.com')
      ? `"TripSync" <${process.env.EMAIL_USER}>`
      : '"TripSync" <noreply@tripsync.app>',
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('?? Preview email at:', previewUrl);
  }
}

module.exports = { sendInviteEmail };
