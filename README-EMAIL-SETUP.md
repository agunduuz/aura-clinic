# Email Setup Guide for Contact Form

## Current Implementation

The contact form is now set up to send emails to `auraclinic@gmail.com` when the submit button is clicked. The current implementation includes:

- ✅ Form validation
- ✅ Loading states
- ✅ Success/Error messages
- ✅ Form reset after successful submission
- ✅ API route for handling email requests

## Email Service Options

### Option 1: EmailJS (Recommended for Quick Setup)

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Create an Email Service:**
   - Go to Email Services
   - Add Gmail service
   - Connect your Gmail account

3. **Create an Email Template:**
   - Go to Email Templates
   - Create a new template
   - Use this template:

```html
<h2>Yeni İletişim Formu Mesajı - Aura Klinik</h2>
<p><strong>Gönderen:</strong> {{from_name}}</p>
<p><strong>E-posta:</strong> {{from_email}}</p>
<p><strong>Telefon:</strong> {{phone}}</p>
<p><strong>Mesaj:</strong></p>
<p>{{message}}</p>
<p><strong>Tarih:</strong> {{timestamp}}</p>
```

4. **Update the API route:**
   - Replace the commented EmailJS code in `/app/api/send-email/route.ts`
   - Add your EmailJS credentials:
     - `service_id`: Your EmailJS service ID
     - `template_id`: Your EmailJS template ID
     - `user_id`: Your EmailJS user ID

### Option 2: Resend (Recommended for Production)

1. **Sign up at [Resend](https://resend.com/)**
2. **Get your API key**
3. **Add to environment variables:**
   ```env
   RESEND_API_KEY=your_api_key_here
   ```
4. **Update the API route:**
   - Uncomment the Resend code in `/app/api/send-email/route.ts`
   - Add your domain verification

### Option 3: Nodemailer with Gmail

1. **Install nodemailer:**

   ```bash
   npm install nodemailer
   ```

2. **Create a Gmail app password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"

3. **Add environment variables:**

   ```env
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```

4. **Update the API route with nodemailer implementation**

## Current Status

The form is fully functional and will:

- ✅ Collect all form data
- ✅ Validate required fields
- ✅ Show loading state during submission
- ✅ Display success/error messages
- ✅ Reset form after successful submission
- ✅ Log email data to console (for testing)

## Testing

To test the current implementation:

1. Fill out the contact form
2. Click "Gönder"
3. Check the browser console for the logged email data
4. The form will show a success message

## Next Steps

1. Choose an email service (EmailJS recommended for quick setup)
2. Follow the setup instructions above
3. Update the API route with your chosen service
4. Test the email functionality

## Security Notes

- Never expose API keys in client-side code
- Always validate and sanitize form inputs
- Consider rate limiting for the email API
- Use environment variables for sensitive data
