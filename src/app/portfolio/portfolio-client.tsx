'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { AiPoweredSolutionsShowcaseOutput } from '@/ai/flows/ai-powered-solutions-showcase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type DevProject = AiPoweredSolutionsShowcaseOutput['showcaseItems'][0] & { image: ImagePlaceholder };

export type RepairProject = {
  device: string;
  issue: string;
  beforeImage: ImagePlaceholder;
  afterImage: ImagePlaceholder;
  testimonial: string;
};

type PortfolioClientProps = {
  developmentProjects: DevProject[];
  repairProjects: RepairProject[];
};

export default function PortfolioClient({ developmentProjects, repairProjects }: PortfolioClientProps) {
  return (
    <Tabs defaultValue="development" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
        <TabsTrigger value="development">Development Projects</TabsTrigger>
        <TabsTrigger value="repairs">Repair Examples</TabsTrigger>
      </TabsList>
      <TabsContent value="development" className="mt-8">
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
      </TabsContent>
      <TabsContent value="repairs" className="mt-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {repairProjects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-2">
                    <div className="relative h-64 w-full">
                        <Image
                        src={project.beforeImage.imageUrl}
                        alt={project.beforeImage.description}
                        data-ai-hint={project.beforeImage.imageHint}
                        fill
                        className="object-cover"
                        />
                        <Badge className="absolute bottom-2 left-2" variant="destructive">Before</Badge>
                    </div>
                    <div className="relative h-64 w-full">
                        <Image
                        src={project.afterImage.imageUrl}
                        alt={project.afterImage.description}
                        data-ai-hint={project.afterImage.imageHint}
                        fill
                        className="object-cover"
                        />
                        <Badge variant="default" className="absolute bottom-2 left-2 border-transparent bg-chart-2 text-primary-foreground hover:bg-chart-2/90">After</Badge>
                    </div>
                </div>
              <CardHeader>
                <CardTitle className="font-headline">{project.device} - {project.issue}</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                  "{project.testimonial}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
