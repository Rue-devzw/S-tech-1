import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, Code, Lightbulb, Users, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Lead AI & Full-Stack Developer',
    bio: 'With over a decade of experience in software engineering, Alex is the architect behind our most innovative AI solutions. He specializes in building scalable, intelligent systems that drive business growth.',
    skills: ['Next.js', 'Python', 'Genkit AI', 'Google Cloud'],
    imageId: 'team-member-1'
  },
  {
    name: 'Maria Garcia',
    role: 'Senior Mobile App Designer',
    bio: 'Maria blends creativity with technical skill to design beautiful, intuitive, and AI-enhanced cross-platform mobile apps. Her user-centric approach ensures a seamless experience on both iOS and Android.',
    skills: ['React Native', 'UI/UX Design', 'Firebase', 'Figma'],
    imageId: 'team-member-2'
  },
  {
    name: 'David Chen',
    role: 'Master Hardware Technician',
    bio: 'David is the foundation of our repair services. With meticulous attention to detail honed since 2014, he can diagnose and fix the most complex hardware issues, ensuring your devices are in expert hands.',
    skills: ['Circuit Board Repair', 'Screen & Battery Replacement', 'Device Refurbishing'],
    imageId: 'team-member-3'
  },
]

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
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">About Us</span>
            <h1 className="font-headline mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The Experts Behind the Tech
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Founded in 2014, S-Tech Solutions is powered by a team of passionate technologists who excel in both hardware and software. We bridge the gap between intricate electronics and intelligent, AI-driven applications.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="mx-auto max-w-3xl text-center">
             <h2 className="font-headline text-3xl font-bold tracking-tight">Meet Our Experts</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The brilliant minds turning your ideas into reality.
            </p>
           </div>
           <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => {
                  const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
                  return (
                    <div key={member.name} className="flex flex-col items-center text-center">
                        {memberImage && 
                           <div className="relative h-40 w-40 overflow-hidden rounded-full shadow-lg mb-4">
                                <Image
                                src={memberImage.imageUrl}
                                alt={`Portrait of ${member.name}`}
                                data-ai-hint={memberImage.imageHint}
                                fill
                                className="object-cover"
                                />
                            </div>
                        }
                        <h3 className="font-headline text-xl font-semibold">{member.name}</h3>
                        <p className="font-medium text-primary">{member.role}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {member.skills.map(skill => (
                                <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                  )
              })}
           </div>
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
