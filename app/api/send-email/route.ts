// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Resend client'ı başlat
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Request body'den form verilerini al
    const { from_name, from_email, phone, message } = await request.json();

    // Validasyon
    if (!from_name || !from_email || !phone || !message) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
      return NextResponse.json(
        { error: "Geçersiz email formatı" },
        { status: 400 }
      );
    }

    // Email gönder
    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Aura Clinic <noreply@auraclinic.com>",
      to: [process.env.EMAIL_TO || "auraclinic@gmail.com"],
      replyTo: from_email,
      subject: `🆕 Yeni İletişim Formu - ${from_name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background-color: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
                display: block;
              }
              .value {
                color: #333;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
                border-left: 3px solid #667eea;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🏥 Aura Clinic</h1>
                <p style="margin: 10px 0 0 0;">Yeni İletişim Formu</p>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">👤 İsim Soyisim:</span>
                  <div class="value">${from_name}</div>
                </div>

                <div class="field">
                  <span class="label">📧 Email:</span>
                  <div class="value">${from_email}</div>
                </div>

                <div class="field">
                  <span class="label">📱 Telefon:</span>
                  <div class="value">${phone}</div>
                </div>

                <div class="field">
                  <span class="label">💬 Mesaj:</span>
                  <div class="value">${message.replace(/\n/g, "<br>")}</div>
                </div>

                <div class="footer">
                  <p>Bu email Aura Clinic iletişim formundan gönderilmiştir.</p>
                  <p>📅 ${new Date().toLocaleString("tr-TR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Hata kontrolü
    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        { error: "Email gönderilemedi", details: error },
        { status: 400 }
      );
    }

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      message: "Email başarıyla gönderildi",
      data,
    });
  } catch (error) {
    console.error("Email Send Error:", error);
    return NextResponse.json(
      {
        error: "Sunucu hatası",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
