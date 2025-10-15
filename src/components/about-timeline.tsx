import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const timelineEvents = [
  {
    year: '2014',
    title: 'S-Tech is Founded',
    description: 'Our journey begins in a small local workshop with a focus on providing high-quality, reliable electronics and mobile phone repairs.',
    imageId: 'about-timeline-1',
  },
  {
    year: '2018',
    title: 'Expansion into Software',
    description: 'Leveraging our deep hardware knowledge, we expanded our services to include custom software and web development for local businesses.',
    imageId: 'about-timeline-2',
  },
  {
    year: '2022',
    title: 'AI Integration',
    description: 'We fully embrace AI, integrating intelligent systems into our development process to offer AI-powered web and app solutions to a global market.',
    imageId: 'about-timeline-3',
  },
  {
    year: 'Today',
    title: 'A Unique Synergy',
    description: 'We stand as a unique technology partner, offering a rare blend of hands-on hardware expertise and sophisticated, AI-driven software development.',
    imageId: 'hero-image',
  }
];

export default function AboutTimeline() {
  return (
    <div className="relative mt-12">
      {/* The timeline line */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border"></div>

      <div className="relative flex flex-col gap-12">
        {timelineEvents.map((event, index) => {
          const image = PlaceHolderImages.find(p => p.id === event.imageId);
          const isOdd = index % 2 !== 0;

          return (
            <div key={event.year} className="relative flex items-center justify-between md:justify-normal md:gap-8">
              {/* Timeline Point */}
              <div className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary md:block"></div>

              {/* Left Side (for even items on desktop) */}
              <div className={`w-full md:w-1/2 ${isOdd ? 'md:order-3' : 'md:order-1 md:text-right'}`}>
                <div className={`inline-block w-full rounded-lg border bg-card p-6 shadow-sm`}>
                  <p className="text-sm font-semibold text-primary">{event.year}</p>
                  <h3 className="mt-1 font-headline text-xl font-bold">{event.title}</h3>
                  <p className="mt-2 text-muted-foreground">{event.description}</p>
                </div>
              </div>
              
              {/* Spacer on Desktop */}
              <div className="hidden w-16 shrink-0 md:block md:order-2"></div>

              {/* Right Side (for odd items on desktop) */}
              <div className={`w-full md:w-1/2 ${isOdd ? 'md:order-1' : 'md:order-3'}`}>
                {image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
