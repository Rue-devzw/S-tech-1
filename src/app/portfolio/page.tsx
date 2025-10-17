
import PortfolioClient from './portfolio-client';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const developmentProjects = [
  {
    title: "AI-Powered E-commerce Analytics",
    description: "A dashboard that provides deep insights into customer behavior using machine learning.",
    technologies: "Next.js, TypeScript, Tailwind CSS, Genkit AI, Recharts",
    outcome: "Increased customer retention by 15% through personalized recommendations.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-1')!
  },
  {
    title: "Cross-Platform Fitness App",
    description: "A mobile app for iOS and Android that tracks workouts and provides AI-driven fitness coaching.",
    technologies: "React Native, Firebase, Genkit AI, Google Cloud",
    outcome: "Achieved 100,000+ downloads within the first 3 months of launch.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-2')!
  },
  {
    title: "SaaS Platform for Logistics",
    description: "A full-stack web application that optimizes delivery routes in real-time, reducing fuel costs.",
    technologies: "Node.js, React, Google Maps API, Python, Genkit AI",
    outcome: "Reduced operational costs by 20% for early adopters.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-3')!
  }
];

export default async function PortfolioPage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Our Work
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore our portfolio of innovative development projects. See the quality and expertise we bring to every task.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <PortfolioClient
            developmentProjects={developmentProjects}
          />
        </div>
      </section>
    </>
  );
}
