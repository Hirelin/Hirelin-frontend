export const SESSION_TOKEN_NAME = "session_id";
export const Contact = {
  email: "hirelin@gmail.com",
  phone: "+91 1234567890",
  github: "https://github.com",
  address: {
    line1: "123 Main Street",
    line2: "Suite 100", // optional
    city: "city",
    state: "State",
    zip: "12345",
    country: "India",
  },
};

const adminEmail = "admin@hirelin.com";
const emailSubject = "Recruiter Account Request";
const emailBody =
  "Hello,\n\nI would like to request a recruiter account on HireLin.\n\nMy details:\nName:\nCompany:\nPosition:\nPhone:\n\nThank you,\n";

export const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(
  emailSubject
)}&body=${encodeURIComponent(emailBody)}`;
