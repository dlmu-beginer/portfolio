import { useState } from 'react';
import { getProfile, listPublishedPosts, listPublishedProjects } from '../lib/db';
import { Hero } from '../components/home/Hero';
import { AboutTimeline } from '../components/home/AboutTimeline';
import { Skills } from '../components/home/Skills';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { BlogSection } from '../components/home/BlogSection';
import { ContactSection } from '../components/home/ContactSection';

export function HomePage(): JSX.Element {
  const [profile] = useState(getProfile);
  const [projects] = useState(listPublishedProjects);
  const [posts] = useState(listPublishedPosts);

  return (
    <>
      <Hero profile={profile} projectCount={projects.length} />
      <AboutTimeline profile={profile} />
      <Skills skills={profile.skills} />
      <ProjectsSection projects={projects} />
      <BlogSection posts={posts} />
      <ContactSection profile={profile} />
    </>
  );
}
