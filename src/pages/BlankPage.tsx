import React from 'react';
import { Helmet } from 'react-helmet';

export const BlankPage: React.FC = () => (
  <>
    <Helmet>
      <title>Blank Page — PRAYAG TECHNO SOLUTIONS</title>
      <meta
        name="description"
        content="A simple blank page on the PRAYAG TECHNO SOLUTIONS website, reserved for future content."
      />
    </Helmet>
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Blank Page
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        This page is intentionally left mostly blank and is reserved for future
        content. Use the navigation above to explore the rest of the website.
      </p>
    </section>
  </>
);

export default BlankPage;
