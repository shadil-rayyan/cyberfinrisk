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

async def send_report_email(to_email: str, company_name: str, executive_summary: str, total_expected_loss: float, total_fix_cost: float, vulnerability_count: int, top_risks: list, attack_chains: list):
    """
    Sends a security risk report to the user.
    """
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD]):
        print("⚠️ SMTP not configured. Skipping email send.")
        return

    message = EmailMessage()
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
    message["To"] = to_email
    message["Subject"] = f"Security Risk Report for {company_name}"

    def fmt_money(val):
        """Format number to money string."""
        if val >= 1_000_000:
            return f"${val/1_000_000:.1f}M"
        return f"${val:,.0f}"

    def sev_col(sev):
        s = sev.lower()
        if s in ["critical", "error"]: return "#e63946"
        if s in ["high", "warning"]: return "#f97316"
        if s == "medium": return "#eab308"
        return "#22c55e"

    top_risks_html = ""
    if top_risks:
        top_risks_html = f"""
            <h3 style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 30px; margin-bottom: 10px;">Top Risks by Financial Exposure</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                        <th style="padding: 10px; color: #64748b;">Type</th>
                        <th style="padding: 10px; color: #64748b;">Severity</th>
                        <th style="padding: 10px; color: #64748b;">Loss</th>
                        <th style="padding: 10px; color: #64748b;">Fix</th>
                    </tr>
                </thead>
                <tbody>
        """
        for r in top_risks:
            top_risks_html += f"""
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px; font-weight: bold; color: #0f172a;">{r.get('bug_type', 'Unknown')}</td>
                    <td style="padding: 10px; font-weight: bold; color: {sev_col(r.get('severity', ''))}">{str(r.get('severity', '')).upper()}</td>
                    <td style="padding: 10px; color: #e63946; font-weight: bold;">{fmt_money(r.get('expected_loss', 0))}</td>
                    <td style="padding: 10px; color: #22c55e;">{fmt_money(r.get('fix_cost_usd', 0))}</td>
                </tr>
            """
        top_risks_html += "</tbody></table>"

    chains_html = ""
    if attack_chains:
        chains_html = f'<h3 style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 30px; margin-bottom: 10px;">Attack Chains Detected ({len(attack_chains)})</h3>'
        for idx, c in enumerate(attack_chains):
            chains_html += f"""
                <div style="background-color: #fff; border: 1px solid #e2e8f0; border-left: 4px solid {sev_col(c.get('combined_severity', ''))}; border-radius: 6px; padding: 15px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 8px;">
                        <strong style="color: #0f172a; font-size: 13px;">CHAIN {str(idx+1).zfill(3)}</strong>
                        <span style="color: #64748b; font-size: 12px; margin-left: 10px;">Exposure: {fmt_money(c.get('combined_expected_loss', 0))}</span>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">{c.get('chain_description', '')}</p>
                </div>
            """

    html_content = f"""
    <html>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 650px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: inline-block; background-color: rgba(230,57,70,0.1); padding: 4px 12px; border-radius: 99px; margin-bottom: 15px;">
                    <strong style="color: #e63946; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Security Risk Report</strong>
                </div>
                <h2 style="margin: 0 0 5px 0; color: #0f172a; font-size: 24px;">{company_name}</h2>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;">
                
                <h3 style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Bottom Line</h3>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Vulnerabilities Found:</strong> <span style="color: #e63946;">{vulnerability_count}</span></p>
                    <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Total Expected Loss:</strong> <span style="color: #f97316;">${total_expected_loss:,.2f}</span></p>
                    <p style="margin: 0; font-size: 15px;"><strong>Estimated Fix Cost:</strong> <span style="color: #22c55e;">${total_fix_cost:,.2f}</span></p>
                </div>

                {top_risks_html}
                {chains_html}

                <h3 style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 30px; margin-bottom: 10px;">Executive Summary</h3>
                <div style="background-color: #1e293b; color: #f8fafc; padding: 20px; border-radius: 8px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 13px; white-space: pre-wrap; line-height: 1.5;">{executive_summary}</div>

                <p style="font-size: 14px; color: #64748b; margin-top: 30px; line-height: 1.6;">
                    To view the full interactive layout and download the PDF securely, please access the FinRisk dashboard.
                </p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 20px;">
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">CyberFinRisk Security Dashboard</p>
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
        print(f"✅ Report email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
