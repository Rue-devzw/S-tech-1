'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { AiPoweredSolutionsShowcaseOutput } from '@/ai/flows/ai-powered-solutions-showcase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type DevProject = AiPoweredSolutionsShowcaseOutput['showcaseItems'][0] & { image: ImagePlaceholder };

type PortfolioClientProps = {
  developmentProjects: DevProject[];
};

export default function PortfolioClient({ developmentProjects }: PortfolioClientProps) {
  return (
    <div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 font-headline">Development Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developmentProjects.map((project, index) => (
            <Card key={index} className="flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={project.image.imageUrl}
                  alt={project.image.description}
                  data-ai-hint={project.image.imageHint}
                  fill
                  className="rounded-t-lg object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Outcome:</h4>
                  <p className="text-sm text-muted-foreground">{project.outcome}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map(tech => (
                      <Badge key={tech.trim()} variant="secondary">{tech.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}
