import { aiPoweredSolutionsShowcase } from '@/ai/flows/ai-powered-solutions-showcase';
import PortfolioClient from './portfolio-client';
import { PlaceHolderImages } from '@/lib/placeholder-images';

async function getDevelopmentProjects() {
  try {
    const showcase = await aiPoweredSolutionsShowcase();
    // Assign placeholder images to the fetched projects
    const devImages = PlaceHolderImages.filter(p => p.id.startsWith('dev-project'));
    return showcase.showcaseItems.map((item, index) => ({
      ...item,
      image: devImages[index % devImages.length] || devImages[0]
    }));
  } catch (error) {
    console.error("Failed to fetch AI-powered solutions:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const developmentProjects = await getDevelopmentProjects();

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
