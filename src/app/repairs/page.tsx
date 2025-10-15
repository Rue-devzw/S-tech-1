import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BatteryCharging, ScreenShare, Smartphone, ToyBrick } from 'lucide-react';
import RepairQuoteForm from './repair-quote-form';

const repairServices = [
  {
    icon: <ScreenShare className="h-8 w-8 text-primary" />,
    title: 'Screen Replacement',
    description: 'Cracked or malfunctioning screen? We offer fast and affordable replacements for most models.'
  },
  {
    icon: <BatteryCharging className="h-8 w-8 text-primary" />,
    title: 'Battery Replacement',
    description: 'If your device isn\'t holding a charge, we can swap in a new, high-quality battery to restore its life.'
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: 'Device Unlocking',
    description: 'Unlock your phone to use it with any carrier. Our services are quick, safe, and reliable.'
  },
  {
    icon: <ToyBrick className="h-8 w-8 text-primary" />,
    title: 'General Refurbishing',
    description: 'Bring your old devices back to life. We offer comprehensive refurbishing to improve performance.'
  },
];

export default function RepairsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Local Repair Services</span>
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Fast, Reliable Repairs
            </h1>
            <p className="text-lg text-muted-foreground">
              We've been your local trusted repair shop since 2014. We use high-quality parts and provide expert service to get your devices back in your hands as quickly as possible.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {repairServices.map((service) => (
              <Card key={service.title} className="flex items-start gap-4 p-4">
                {service.icon}
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Get a Free AI-Powered Quote</CardTitle>
              <CardDescription>
                Tell us about your device and the issue. Our AI will generate a real-time repair quote for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepairQuoteForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
