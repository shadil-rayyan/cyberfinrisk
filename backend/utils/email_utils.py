import os
import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT_STR = os.getenv("SMTP_PORT", "587").strip()
SMTP_PORT = int(SMTP_PORT_STR) if SMTP_PORT_STR.isdigit() else 587
SMTP_USER = os.getenv("SMTP_USER", "").strip()
# Gmail App Passwords are 16 chars, often shown with spaces. We must remove them.
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").replace(" ", "").strip()
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "FinRisk").strip()

async def send_invite_email(to_email: str, org_name: str, invite_token: str, inviter_name: str):
    """
    Sends an invitation email to the user.
    """
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD]):
        print("⚠️ SMTP not configured. Skipping email send.")
        return

    # In a real app, this would be the actual frontend URL
    invite_link = f"http://localhost:3000/dashboard/invites/{invite_token}"

    message = EmailMessage()
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
    message["To"] = to_email
    message["Subject"] = f"Invitation to join {org_name} on FinRisk"

    html_content = f"""
    <html>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #d946ef;">You've been invited!</h2>
                <p>Hello,</p>
                <p><strong>{inviter_name}</strong> has invited you to join the <strong>{org_name}</strong> organization on FinRisk.</p>
                <div style="margin: 30px 0;">
                    <a href="{invite_link}" 
                       style="background-color: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                       Accept Invitation
                    </a>
                </div>
                <p style="font-size: 0.9em; color: #666;">If you didn't expect this invitation, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8em; color: #999;">FinRisk Security Dashboard</p>
            </div>
        </body>
    </html>
    """
    message.add_alternative(html_content, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            start_tls=True if SMTP_PORT == 587 else False
        )
        print(f"✅ Invite email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
