import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Check, Code, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const technologies = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Firebase', 'Google Cloud', 'Genkit AI'
];

const processSteps = [
    { title: 'Discovery &amp; Strategy', description: 'We start by understanding your goals and architecting an AI-driven solution.' },
    { title: 'Design &amp; Prototyping', description: 'Crafting intuitive, user-centric designs for cross-platform applications.' },
    { title: 'AI-Enhanced Development', description: 'Building your application with intelligent features at its core.' },
    { title: 'Testing &amp; Deployment', description: 'Ensuring a robust, scalable, and secure launch on your chosen platform.' },
];

export default function DevelopmentPage() {
    return (
      <>
        <section className="bg-secondary/30 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">Global Development Services</span>
                    <h1 className="font-headline mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Build Smarter with AI
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        We specialize in creating intelligent, full-stack web and mobile applications. Our unique blend of development expertise and AI integration delivers powerful, future-proof solutions for businesses worldwide.
                    </p>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Code className="h-10 w-10 text-primary"/>
                                <CardTitle className="font-headline text-2xl">AI-Powered Web Development</CardTitle>
                            </div>
                            <CardDescription>
                                From dynamic e-commerce platforms to complex SaaS applications, we build web solutions that learn, adapt, and drive results.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                           <ul className="space-y-2">
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Intelligent automation and workflow optimization.</span></li>
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Personalized user experiences and recommendation engines.</span></li>
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Predictive analytics and data-driven insights.</span></li>
                           </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button asChild className="w-full">
                               <Link href="/portfolio">View Web Projects <ArrowRight className="ml-2 h-4 w-4"/></Link>
                           </Button>
                        </div>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <Smartphone className="h-10 w-10 text-primary"/>
                                <CardTitle className="font-headline text-2xl">AI-Enhanced App Design</CardTitle>
                            </div>
                            <CardDescription>
                                We design and develop cross-platform mobile apps that are not only beautiful and intuitive but also powered by smart, AI-driven features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                           <ul className="space-y-2">
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Computer vision and natural language processing.</span></li>
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>On-device AI for fast, offline functionality.</span></li>
                               <li className="flex gap-2"><Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Seamless user experiences across iOS and Android.</span></li>
                           </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button asChild className="w-full">
                               <Link href="/portfolio">View App Projects <ArrowRight className="ml-2 h-4 w-4"/></Link>
                           </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        <section className="bg-secondary/30 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <h2 className="font-headline text-3xl font-bold tracking-tight">Our Development Process</h2>
                        <p className="mt-4 text-muted-foreground">We follow a structured, agile methodology to ensure your project's success from concept to launch.</p>
                        <div className="mt-8 space-y-6">
                            {processSteps.map((step, index) => (
                                <div key={step.title} className="flex">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{index + 1}</div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {PlaceHolderImages.find(p => p.id === 'dev-project-3') &amp;&amp;
                        <div className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg">
                            <Image
                                src={PlaceHolderImages.find(p => p.id === 'dev-project-3')!.imageUrl}
                                alt="Data visualization"
                                data-ai-hint={PlaceHolderImages.find(p => p.id === 'dev-project-3')!.imageHint}
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
                    <h2 className="font-headline text-3xl font-bold tracking-tight">Technologies We Master</h2>
                    <p className="mt-4 text-muted-foreground">We use a modern, robust tech stack to build high-performance applications.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {technologies.map(tech => (
                            <div key={tech} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-accent/80 text-accent-foreground py-16 md:py-24">
             <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight">Ready to build your next big idea?</h2>
                <p className="mt-4 max-w-2xl mx-auto">Let's discuss how our AI-enhanced development services can bring your vision to life.</p>
                <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/contact">Schedule a Free Consultation</Link>
                </Button>
            </div>
        </section>
      </>
    );
}
