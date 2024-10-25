import { cn } from "@/lib/utils";
import {
  IconRocket,
  IconBrandNextjs,
  IconBrandTailwind,
  IconDatabase,
  IconMail,
  IconLock,
  IconPuzzle,
  IconCode,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Quick Start",
      description:
        "Get your project off the ground quickly with our pre-configured setup.",
      icon: <IconRocket />,
    },
    {
      title: "Next.js Powered",
      description:
        "Leverage the power of Next.js for server-side rendering and optimal performance. The best ngl.",
      icon: <IconBrandNextjs />,
    },
    {
      title: "Tailwind CSS Styling",
      description:
        "Create beautiful, responsive designs effortlessly with Tailwind CSS.",
      icon: <IconBrandTailwind />,
    },
    {
      title: "PostgreSQL & Drizzle ORM",
      description:
        "Robust database setup with PostgreSQL and easy data management using Drizzle ORM.",
      icon: <IconDatabase />,
    },
    {
      title: "Email Integration",
      description:
        "Seamless email functionality with Resend for transactional emails and notifications.",
      icon: <IconMail />,
    },
    {
      title: "Authentication",
      description:
        "Secure authentication out of the box with Auth Js.",
      icon: <IconLock />,
    },
    {
      title: "UI Component Library",
      description:
        "Beautiful components from ShadCN, MagicUI, and Aceternity UI.",
      icon: <IconPuzzle />,
    },
    {
      title: "Developer Friendly",
      description:
        "Built for developers, by developers. Easily extensible and customizable.",
      icon: <IconCode />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
