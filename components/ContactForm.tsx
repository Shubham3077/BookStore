"use client"

import { useState } from "react"
import { Send, AlertCircle } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { saveContact } from "@/lib/firestore-contact"
import { useAuth } from "@/lib/firebase-auth-context"

type FormErrors = {
  name?: string
  email?: string
  message?: string
}

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be under 100 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "Message must be under 1000 characters"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await saveContact(formData, user?.uid || null)
      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setFormErrors({})
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
              Have a question or suggestion? We'd love to hear from you.
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Message Sent
                </h2>
                <p className="text-muted-foreground text-sm">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-destructive text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={formErrors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {formErrors.message && (
                    <p className="text-destructive text-xs mt-1">{formErrors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}

export default ContactForm
