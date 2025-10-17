
import PortfolioClient from './portfolio-client';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const developmentProjects = [
  {
    title: "Mussy Consultancy",
    description: "A professional corporate website designed to enhance online presence and client engagement for a business consultancy firm.",
    technologies: "Next.js, TypeScript, Tailwind CSS, ShadCN UI",
    outcome: "Successfully established a strong digital footprint, leading to a 25% increase in client inquiries.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-1')!,
    link: "https://www.mussyconsultancy.org"
  },
  {
    title: "Valley Farm Secrets",
    description: "An e-commerce platform for a farm-to-table business, featuring product listings, online ordering, and a blog for recipes.",
    technologies: "React, Firebase, Node.js, Stripe Integration",
    outcome: "Streamlined the sales process and expanded customer reach, resulting in a 40% growth in online sales.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-2')!,
    link: "https://www.valleyfarmsecrets.com"
  },
  {
    title: "S-Tech Solutions Official",
    description: "The official website for S-Tech Solutions, showcasing services in AI-powered development and local electronics repair.",
    technologies: "Next.js, Genkit AI, Tailwind CSS, Vercel",
    outcome: "Created a comprehensive platform that clearly segments services and has improved lead generation by 30%.",
    image: PlaceHolderImages.find(p => p.id === 'dev-project-3')!,
    link: "https://www.s-techsolutions.org"
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
