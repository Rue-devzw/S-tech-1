
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, Lightbulb, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const teamMember = {
    name: 'Alex Doe',
    role: 'Founder, Lead Developer & Technician',
    bio: 'As the founder of S-Tech Solutions, Alex combines a passion for hands-on electronics repair with expertise in cutting-edge, AI-driven software development. With a journey that started in 2014, he offers a unique, holistic approach to technology, ensuring both hardware and software work in perfect harmony.',
    skills: ['Full-Stack Development', 'AI Integration', 'Mobile & Electronics Repair', 'Next.js', 'Genkit AI'],
    imageId: 'team-member-1'
  };

const values = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Quality Craftsmanship',
    description: 'From the smallest solder point to the most complex algorithm, I pursue excellence in everything I build.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Practical Innovation',
    description: 'I believe in innovation that solves real-world problems, blending cutting-edge tech with tangible results.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Client Partnership',
    description: 'I work with you, not just for you. Your success is my ultimate metric, and I build lasting relationships.',
  },
];

export default function AboutPage() {
  const memberImage = PlaceHolderImages.find(p => p.id === teamMember.imageId);

  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">About S-Tech</span>
            <h1 className="font-headline mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The Expert Behind the Tech
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Founded in 2014, S-Tech Solutions is driven by a passionate technologist who excels in both hardware and software. I bridge the gap between intricate electronics and intelligent, AI-driven applications.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="mx-auto max-w-3xl text-center">
             <h2 className="font-headline text-3xl font-bold tracking-tight">Meet the Expert</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The mind turning your ideas into reality.
            </p>
           </div>
           <div className="mt-12 flex justify-center">
              <div className="flex max-w-md flex-col items-center text-center">
                  {memberImage && 
                      <div className="relative h-40 w-40 overflow-hidden rounded-full shadow-lg mb-4">
                          <Image
                          src={memberImage.imageUrl}
                          alt={`Portrait of ${teamMember.name}`}
                          data-ai-hint={memberImage.imageHint}
                          fill
                          className="object-cover"
                          />
                      </div>
                  }
                  <h3 className="font-headline text-xl font-semibold">{teamMember.name}</h3>
                  <p className="font-medium text-primary">{teamMember.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{teamMember.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {teamMember.skills.map(skill => (
                          <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                              {skill}
                          </span>
                      ))}
                  </div>
              </div>
           </div>
        </div>
      </section>
      
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight">My Core Values</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The principles that guide my work and my partnerships.
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
                Whether you need a device repaired or a custom AI solution built, I'm ready to help.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Get in Touch</Link>
            </Button>
        </div>
      </section>
    </>
  );
}
