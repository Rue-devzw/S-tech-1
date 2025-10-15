import { Mail, MapPin, Phone } from 'lucide-react';
import ConsultationForm from './consultation-form';

const contactDetails = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: 'Email',
    value: 'contact@stechservices.com',
    href: 'mailto:contact@stechservices.com'
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: 'Phone',
    value: '+263718704505',
    href: 'tel:+263718704505'
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: 'Address',
    value: '123 Tech Street, Silicon Valley, CA 94000',
  }
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We're here to help. Whether you have a question about a repair, a development project, or anything else, our team is ready to answer your questions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
              <p className="mt-2 text-muted-foreground">Find us at our office or reach out to us online.</p>
              <div className="mt-8 space-y-6">
                {contactDetails.map((detail) => (
                  <div key={detail.title} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      {detail.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{detail.title}</h3>
                      {detail.href ? (
                        <a href={detail.href} className="text-muted-foreground hover:text-primary">
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="font-headline text-2xl font-bold">Schedule a Consultation</h2>
                <p className="mt-2 text-muted-foreground">
                  Have a development project in mind? Fill out the form below to schedule a free, no-obligation consultation with our experts.
                </p>
                <div className="mt-6">
                  <ConsultationForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
