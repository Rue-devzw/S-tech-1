import { Mail, MapPin, Phone } from 'lucide-react';
import ConsultationForm from './consultation-form';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.413-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.5-5.604-1.438l-6.26-1.673zm6.715-4.82a9.376 9.376 0 005.132 1.431c5.176.001 9.38-4.203 9.382-9.379.002-5.176-4.204-9.38-9.38-9.38-5.175 0-9.378 4.204-9.38 9.38 0 2.021.653 3.934 1.838 5.542l-1.155 4.226 4.354-1.156zM13.255 12.427l-.462-.233c-.958-.484-1.564-.73-1.564-1.565 0-.835.63-1.428 1.383-1.428.106 0 .21.01.312.031.543.111 1.225.594 1.336 1.562l.062.533-.462.232c-.958.484-1.565.73-1.565 1.565 0 .835.63 1.428 1.384 1.428.105 0 .21-.01.31-.031.543-.111 1.225-.594 1.337-1.562l.062-.533z"/>
    </svg>
);

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
    icon: <WhatsAppIcon className="h-6 w-6 text-primary" />,
    title: 'WhatsApp',
    value: '+263718704505',
    href: 'https://wa.me/263718704505'
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
