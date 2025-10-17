
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type DevProject = {
  title: string;
  description: string;
  technologies: string;
  outcome: string;
  image: ImagePlaceholder;
  link: string;
};

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
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
    </div>
  );
}
