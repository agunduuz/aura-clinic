// prisma/seeds/09-contact.seed.ts
import { PrismaClient } from "@prisma/client";
export async function seedContact(prisma: PrismaClient) {
  console.log("🔄 Seeding contact page...");
  const existing = await prisma.contactPage.findFirst();
  if (existing) {
    console.log("✅ Contact page already seeded!");
    return;
  }
  await prisma.contactPage.createMany({
    data: [
      {
        locale: "tr",
        headerTitle: "Bizimle\nİletişime Geçin",
        headerDescription:
          "Sorularınız mı var? Size yardımcı olmaktan mutluluk duyarız.",
        headerButtonText: "Randevu Alın",
        headerImage: "/images/doctors-team.jpg",
        formTitle: "İletişim Bilgileri",
        formDescription: "Aşağıdaki bilgilerden bize ulaşabilirsiniz.",
        happyCustomersText: "500+ Mutlu Müşteri",
        reviewsRating: "4.8",
        reviewsText: "Google'da 250+ değerlendirme",
        reviewsLink: "https://google.com",
        addressLabel: "Adresimiz",
        addressText: "İstanbul, Türkiye",
        phoneLabel: "Telefon",
        phoneText: "+90 212 111 11 11",
        phoneLink: "tel:+902121111111",
        hoursLabel: "Çalışma Saatleri",
        hoursText: "Pazartesi - Cuma: 09:00 - 19:00",
        formTitleBox: "Formu Doldurun",
        formSubtitle: "Lütfen bilgilerinizi girin",
        firstNamePlaceholder: "Adınız",
        lastNamePlaceholder: "Soyadınız",
        emailPlaceholder: "E-posta",
        phonePlaceholder: "Telefon",
        messagePlaceholder: "Mesajınız",
        submitButtonText: "Gönder",
        submittingButtonText: "Gönderiliyor...",
        successMessage: "Mesajınız başarıyla gönderildi!",
        errorMessage: "Bir hata oluştu.",
        emailRecipient: "auraclinic@gmail.com",
        emailSubject: "Yeni İletişim Formu Mesajı",
      },
      {
        locale: "en",
        headerTitle: "Get in\nTouch",
        headerDescription: "Have questions? We'd love to help.",
        headerButtonText: "Book Appointment",
        headerImage: "/images/doctors-team.jpg",
        formTitle: "Contact Information",
        formDescription: "You can reach us through the information below.",
        happyCustomersText: "500+ Happy Customers",
        reviewsRating: "4.8",
        reviewsText: "250+ reviews on Google",
        reviewsLink: "https://google.com",
        addressLabel: "Address",
        addressText: "Istanbul, Turkey",
        phoneLabel: "Phone",
        phoneText: "+90 212 111 11 11",
        phoneLink: "tel:+902121111111",
        hoursLabel: "Working Hours",
        hoursText: "Monday - Friday: 09:00 - 19:00",
        formTitleBox: "Fill the Form",
        formSubtitle: "Please enter your information",
        firstNamePlaceholder: "First Name",
        lastNamePlaceholder: "Last Name",
        emailPlaceholder: "Email",
        phonePlaceholder: "Phone",
        messagePlaceholder: "Your Message",
        submitButtonText: "Submit",
        submittingButtonText: "Submitting...",
        successMessage: "Your message has been sent successfully!",
        errorMessage: "An error occurred.",
        emailRecipient: "auraclinic@gmail.com",
        emailSubject: "New Contact Form Message",
      },
    ],
  });
  console.log("✅ Contact page seeded!");
}
