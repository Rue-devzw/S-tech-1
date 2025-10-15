import AboutTimeline from '@/components/about-timeline';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, Lightbulb, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const values = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Quality Craftsmanship',
    description: 'From the smallest solder point to the most complex algorithm, we pursue excellence in everything we build.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Practical Innovation',
    description: 'We believe in innovation that solves real-world problems, blending cutting-edge tech with tangible results.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Customer Partnership',
    description: 'We work with you, not just for you. Your success is our ultimate metric, and we build lasting relationships.',
  },
];

export default function AboutPage() {
  const whyUsImage = PlaceHolderImages.find(p => p.id === 'why-us-image');

  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">Our Story</span>
              <h1 className="font-headline mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Bridging Hardware and Software
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Founded in 2014, S-Tech Services started with a simple mission: to provide expert, trustworthy electronics repairs. Our deep understanding of hardware gave us a unique perspective as we evolved, leading us into the world of software development where we now build the intelligent systems of the future.
              </p>
            </div>
            {whyUsImage &&
              <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg lg:h-96">
                <Image
                  src={whyUsImage.imageUrl}
                  alt={whyUsImage.description}
                  data-ai-hint={whyUsImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            }
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Our Journey Since 2014</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A timeline of our evolution from a local repair shop to a global technology partner.
            </p>
          </div>
          <AboutTimeline />
        </div>
      </section>

      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Our Core Values</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The principles that guide our work and our partnerships.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-md">
                  {value.icon}
                </div>
                <h3 className="font-headline text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Let's Build Together</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Whether you need a device repaired or a custom AI solution built, our team is ready to help.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Get in Touch</Link>
            </Button>
        </div>
      </section>
    </>
  );
}
