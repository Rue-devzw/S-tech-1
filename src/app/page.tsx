import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Cpu, Star, Wrench, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
  {
    name: 'Jane Doe, Local Customer',
    title: 'Flawless Screen Repair',
    quote: 'My iPhone screen was shattered. S-Tech fixed it in under an hour, and it looks brand new. The "since 2014" sign gave me confidence, and they delivered!',
    rating: 5,
  },
  {
    name: 'John Smith, CEO of InnovateCorp',
    title: 'Game-Changing AI Integration',
    quote: 'S-Tech\'s AI-powered web solution revolutionized our e-commerce platform. Their expertise in both development and AI is a rare and valuable combination.',
    rating: 5,
  },
  {
    name: 'Emily White, Startup Founder',
    title: 'From Idea to App Store',
    quote: 'The team at S-Tech turned our app idea into a reality. Their AI-enhanced approach to cross-platform development was efficient and incredibly effective.',
    rating: 5,
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-background pt-16 md:pt-24 lg:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <span className="rounded-full bg-accent/20 px-4 py-1 text-sm font-medium text-accent-foreground self-start">
                Established 2014: Hardware Expertise & Software Innovation
              </span>
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Expert Repairs.
                <br />
                Intelligent Solutions.
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                S-Tech Services bridges the gap between hands-on hardware repair and sophisticated, AI-driven software development.
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button asChild size="lg">
                    <Link href="/development">Explore Development</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                     <Link href="/repairs">Request a Repair</Link>
                  </Button>
              </div>
            </div>
            {heroImage && (
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-2xl lg:h-auto">
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                    />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Audience Splitter Section */}
      <section id="services" className="w-full bg-secondary/30 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center justify-center gap-8 text-center">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">How can we help you today?</h2>
              <p className="text-muted-foreground md:text-lg">
                Choose your path. We have specialized services for both personal devices and business-level development projects.
              </p>
            </div>
            <div className="grid w-full gap-6 sm:grid-cols-2">
              <Link href="/repairs" className="group">
                <Card className="flex flex-col justify-between h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <CardHeader className="items-center space-y-4 text-center">
                    <Wrench className="h-12 w-12 text-primary" />
                    <CardTitle className="font-headline text-2xl">Local Repairs</CardTitle>
                    <CardDescription>
                      Need a quick fix for your phone or device? Get a free, instant quote for our expert, local repair services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full font-semibold" variant="outline">
                      Get Repair Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/development" className="group">
                <Card className="flex flex-col justify-between h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <CardHeader className="items-center space-y-4 text-center">
                    <Cpu className="h-12 w-12 text-primary" />
                    <CardTitle className="font-headline text-2xl">Global Development</CardTitle>
                    <CardDescription>
                      Looking for AI-powered web or app development? Explore our high-tech solutions for businesses and startups.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full font-semibold" variant="default">
                      Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full bg-background py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">Why S-Tech Services</span>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Your Trusted Partner Since 2014</h2>
              <p className="text-muted-foreground md:text-lg">
                For over a decade, we've built our reputation on trust, quality, and a unique ability to solve problems across the entire tech spectrum. Our foundation in hardware gives us a practical edge in our advanced software development.
              </p>
              <ul className="grid gap-4 text-lg">
                <li className="flex items-start">
                  <Check className="mr-4 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>
                    <strong>Proven Reliability:</strong> A decade of service and satisfied customers.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-4 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>
                    <strong>Dual Expertise:</strong> Unmatched combination of hardware repair and AI software engineering.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-4 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>
                    <strong>Future-Ready Solutions:</strong> We leverage cutting-edge AI to build robust, scalable applications.
                  </span>
                </li>
              </ul>
              <Button asChild size="lg" className="mt-4">
                <Link href="/about">
                  Learn Our Story
                </Link>
              </Button>
            </div>
             {PlaceHolderImages.find(p => p.id === 'why-us-image') && (
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg lg:h-96">
                    <Image
                    src={PlaceHolderImages.find(p => p.id === 'why-us-image')!.imageUrl}
                    alt={PlaceHolderImages.find(p => p.id === 'why-us-image')!.description}
                    data-ai-hint={PlaceHolderImages.find(p => p.id === 'why-us-image')!.imageHint}
                    fill
                    className="object-cover"
                    />
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-secondary/30 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Voices of Our Customers</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
              We're proud of the relationships we've built and the results we've delivered.
            </p>
          </div>
          <Carousel
            opts={{ align: "start" }}
            className="mx-auto mt-12 w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-grow flex-col">
                        <p className="flex-grow font-semibold">"{testimonial.quote}"</p>
                        <p className="mt-4 text-sm text-muted-foreground">&mdash; {testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

    </div>
  );
}
