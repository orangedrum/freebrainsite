interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  headingLevel?: 1 | 2;
}

/** Reusable centered section heading with optional subtitle. */
export const SectionHeading = ({
  title,
  subtitle,
  className = "",
  headingLevel = 2,
}: SectionHeadingProps) => {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className={`text-center mb-16 md:mb-24 ${className}`}>
      <Heading className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
