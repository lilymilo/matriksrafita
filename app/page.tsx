import React from 'react';
import {
  CriticalAnalysisServer,
  EditorialFooterServer,
  PersonaContextBandServer,
  SelectedConceptsServer,
} from '@/components/server/EditorialSections';
import { IdeaQuestAppShell } from '@/components/studio/IdeaQuestWorkspace';

/**
 * Root Next.js App Router Page — Server Component by default.
 * Static LKPD 3–5 editorial context, Selected Concepts, Critical Analysis, and Footer
 * render on the server and compose into the sidebar workspace shell via ReactNode slots.
 */
export default function HomePage() {
  return (
    <main>
      <IdeaQuestAppShell
        personaBand={<PersonaContextBandServer />}
        selectedConcepts={<SelectedConceptsServer />}
        criticalAnalysis={<CriticalAnalysisServer />}
        footer={<EditorialFooterServer />}
      />
    </main>
  );
}
