"use client";

import { motion } from "framer-motion";
import { ChevronRight, Monitor, Smartphone, Apple } from "lucide-react";

interface App {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  borderColor: string;
  hoverBg: string;
  iconColor: string;
}

const AppDownloadSection = () => {
  const apps: App[] = [
    {
      name: "Windows App",
      icon: Monitor,
      url: "https://cdn-cp-assets-public.classplus.co/CampaignManager/35632a30-88dc-11f1-9190-39bdfaaed339.exe",
      borderColor: "border-blue-500",
      hoverBg: "hover:bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      name: "Android App",
      icon: Smartphone,
      url: "https://play.google.com/store/apps/details?id=co.classplus.app&orgcode=acmea",
      borderColor: "border-green-500",
      hoverBg: "hover:bg-green-50",
      iconColor: "text-green-500",
    },
    {
      name: "iOS App",
      icon: Apple,
      url: "https://apps.apple.com/app/classplus/id1465936412?utm_source=web_app&orgcode=acmea",
      borderColor: "border-gray-400",
      hoverBg: "hover:bg-gray-50",
      iconColor: "text-gray-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {apps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <motion.a
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`border-2 ${app.borderColor} rounded-xl p-4 ${app.hoverBg} transition-all duration-300 h-16 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ${app.iconColor}`} />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900">
                      {app.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
