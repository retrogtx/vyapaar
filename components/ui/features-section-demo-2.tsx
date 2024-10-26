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
      title: "Smart Dashboard",
      description:
        "Comprehensive overview with customizable widgets, real-time analytics, and AI-driven insights for your CRM data.",
      icon: <IconRocket />,
    },
    {
      title: "A/B Testing",
      description:
        "Run sophisticated A/B tests on campaigns with analysis from real audience to optimize your marketing banners.",
      icon: <IconBrandNextjs />,
    },
    {
      title: "Customer Management",
      description:
        "Advanced customer segmentation with AI-driven insights based on cultural, regional, and socio-economic factors.",
      icon: <IconBrandTailwind />,
    },
    {
      title: "AI Campaign Builder",
      description:
        "Create personalized, culturally-aware campaigns with AI-generated content in multiple Indian languages.",
      icon: <IconDatabase />,
    },
    {
      title: "Lead Generation",
      description:
        "AI-powered lead scoring and qualification system to identify and nurture high-potential prospects.",
      icon: <IconMail />,
    },
    {
      title: "Secure Authentication",
      description:
        "Enterprise-grade security with role-based access control and data encryption.",
      icon: <IconLock />,
    },
    {
      title: "AI Chat Support",
      description:
        "Multilingual chatbot with cultural awareness for automated customer support and engagement.",
      icon: <IconPuzzle />,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics with AI-driven insights, predictive modeling, and customizable reporting.",
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
