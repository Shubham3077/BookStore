import ContactForm from "@/components/ContactForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Mudita Book Store",
  description: "Get in touch with us. Have a question or suggestion? We'd love to hear from you.",
}

export default function ContactPage() {
  return <ContactForm />
}
