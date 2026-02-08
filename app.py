from flask import Flask, render_template, request, jsonify,send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key="jeel101"

# ========== EMAIL CONFIGURATION ==========
SENDER_EMAIL = os.getenv("GMAIL")
SENDER_PASSWORD = os.getenv("GMAIL_PASS")
YOUR_EMAIL = os.getenv("GMAIL")


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sales')
def sales():
    return send_from_directory("static","Sales.html")

@app.route('/send-message', methods=['POST'])
def send_message():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return jsonify({
                'success': False,
                'message': 'All fields are required!'
            }), 400

        user_msg = MIMEMultipart('alternative')
        user_msg['Subject'] = 'Message Received - Jeel Portfolio'
        user_msg['From'] = SENDER_EMAIL
        user_msg['To'] = email

        user_html = f"""
        <html>
            <head>
                <style>
                    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background: #0a0a0a; }}
                    .container {{ max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 16px; }}
                    .content {{ background: #ffffff; padding: 40px; border-radius: 14px; }}
                    h1 {{ color: #667eea; font-size: 28px; margin-bottom: 10px; }}
                    .greeting {{ color: #333; font-size: 18px; margin-bottom: 20px; }}
                    .message-box {{ background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0; }}
                    .message-box strong {{ color: #667eea; display: block; margin-bottom: 10px; font-size: 16px; }}
                    .message-box p {{ color: #555; line-height: 1.8; }}
                    .footer {{ text-align: center; color: #888; margin-top: 30px; font-size: 14px; padding-top: 20px; border-top: 1px solid #eee; }}
                    .highlight {{ color: #667eea; font-weight: 600; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>Thanks for reaching out!</h1>
                        <p class="greeting">Hi <span class="highlight">{name}</span>,</p>
                        <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>

                        <div class="message-box">
                            <strong>Your Message Details:</strong>
                            <p><strong>Subject:</strong> {subject}</p>
                            <p><strong>Message:</strong><br>{message}</p>
                        </div>

                        <p>I appreciate you taking the time to connect. You can expect a response within 24-48 hours.</p>

                        <div class="footer">
                            <p>Best regards,<br><strong>Jeel</strong></p>
                            <p style="margin-top: 10px;">&copy; {datetime.now().year} Jeel. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """

        user_msg.attach(MIMEText(user_html, 'html'))

        owner_msg = MIMEMultipart('alternative')
        owner_msg['Subject'] = f'🔔 New Portfolio Contact: {subject}'
        owner_msg['From'] = SENDER_EMAIL
        owner_msg['To'] = YOUR_EMAIL

        owner_html = f"""
        <html>
            <head>
                <style>
                    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background: #0a0a0a; }}
                    .container {{ max-width: 600px; margin: 40px auto; background: #1a1a2e; padding: 2px; border-radius: 16px; }}
                    .content {{ background: #ffffff; padding: 40px; border-radius: 14px; }}
                    h1 {{ color: #667eea; font-size: 28px; margin-bottom: 20px; }}
                    .alert {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 4px; }}
                    .info-grid {{ display: grid; gap: 15px; margin: 25px 0; }}
                    .info-item {{ background: #f8f9fa; padding: 15px; border-radius: 8px; }}
                    .label {{ font-weight: 600; color: #667eea; display: block; margin-bottom: 5px; }}
                    .value {{ color: #333; }}
                    .message-box {{ background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3; margin: 25px 0; }}
                    .footer {{ text-align: center; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>🎉 New Message from Portfolio!</h1>

                        <div class="alert">
                            <strong>⚡ Action Required:</strong> You have a new contact form submission from your portfolio website.
                        </div>

                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">👤 From:</span>
                                <span class="value">{name}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">📧 Email:</span>
                                <span class="value">{email}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">📋 Subject:</span>
                                <span class="value">{subject}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">📅 Date & Time:</span>
                                <span class="value">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</span>
                            </div>
                        </div>

                        <div class="message-box">
                            <strong style="color: #2196F3; display: block; margin-bottom: 10px;">💬 Message:</strong>
                            <p style="color: #333; line-height: 1.8;">{message}</p>
                        </div>

                        <div class="footer">
                            <p>This is an automated notification from your portfolio contact form.</p>
                            <p style="margin-top: 5px;">Reply directly to <strong>{email}</strong> to respond.</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """

        owner_msg.attach(MIMEText(owner_html, 'html'))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)

            server.send_message(user_msg)

            server.send_message(owner_msg)

        return jsonify({
            'success': True,
            'message': 'Message sent successfully! Check your email for confirmation.'
        })

    except smtplib.SMTPAuthenticationError:
        print("SMTP Authentication Error: Check your email and password")
        return jsonify({
            'success': False,
            'message': 'Email configuration error. Please contact the administrator.'
        }), 500

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to send message. Please try again later.'
        }), 500


