import logging
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

from app.config import config

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_verification_email(to_email: str, username: str, verification_url: str) -> bool:
        subject = "Xác thực tài khoản SocialMeme"
        text_body = (
            f"Xin chào {username},\n\n"
            "Cảm ơn bạn đã đăng ký SocialMeme.\n"
            "Hãy nhấn vào liên kết bên dưới để xác thực tài khoản:\n"
            f"{verification_url}\n\n"
            f"Liên kết này sẽ hết hạn sau {config.EMAIL_VERIFICATION_EXPIRE_HOURS} giờ.\n"
        )
        html_body = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="color: #dc2626;">Xác thực tài khoản SocialMeme</h2>
          <p>Xin chào <strong>{username}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký SocialMeme. Hãy nhấn vào nút bên dưới để xác thực tài khoản.</p>
          <p style="margin: 24px 0;">
            <a
              href="{verification_url}"
              style="background: #dc2626; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; display: inline-block;"
            >
              Xác thực email
            </a>
          </p>
          <p>Nếu nút không hoạt động, bạn có thể mở liên kết này:</p>
          <p><a href="{verification_url}">{verification_url}</a></p>
          <p>Liên kết này sẽ hết hạn sau {config.EMAIL_VERIFICATION_EXPIRE_HOURS} giờ.</p>
        </div>
        """
        sent = EmailService.send_email(to_email, subject, text_body, html_body)
        if not sent:
            logger.warning("SMTP chưa được cấu hình. Verification link for %s: %s", to_email, verification_url)
        return sent

    @staticmethod
    def send_email(to_email: str, subject: str, text_body: str, html_body: str | None = None) -> bool:
        if not config.SMTP_HOST:
            return False

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = formataddr((config.EMAIL_FROM_NAME, config.EMAIL_FROM_EMAIL))
        message["To"] = to_email
        message.set_content(text_body)
        if html_body:
            message.add_alternative(html_body, subtype="html")

        try:
            if config.SMTP_USE_SSL:
                with smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT) as server:
                    EmailService._login_and_send(server, message)
            else:
                with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
                    server.ehlo()
                    if config.SMTP_USE_TLS:
                        server.starttls()
                        server.ehlo()
                    EmailService._login_and_send(server, message)
            return True
        except Exception:
            logger.exception("Không gửi được email xác thực tới %s", to_email)
            return False

    @staticmethod
    def _login_and_send(server: smtplib.SMTP, message: EmailMessage) -> None:
        if config.SMTP_USERNAME:
            server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
        server.send_message(message)