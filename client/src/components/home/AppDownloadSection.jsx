import { motion } from "framer-motion";
import { ChevronRight, Monitor, Smartphone, Apple } from "lucide-react";

const AppDownloadSection = () => {
  const apps = [
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
      url: "https://play.google.com/store/apps/details?id=in.testpress.acmeacademy&pcampaignid=web_share",
      borderColor: "border-green-500",
      hoverBg: "hover:bg-green-50",
      iconColor: "text-green-500",
    },
    {
      name: "iOS App",
      icon: Apple,
      url: "https://apps.apple.com/us/app/classplus/id1324522260?utm_campaign=acmea",
      borderColor: "border-gray-400",
      hoverBg: "hover:bg-gray-50",
      iconColor: "text-gray-900",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 uppercase mb-2">
            Get The ACME App
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Download the app on your device
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {apps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <motion.a
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`border-2 ${app.borderColor} rounded-xl p-4 transition-all duration-300 ${app.hoverBg} cursor-pointer flex items-center justify-between group-hover:shadow-md h-16`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" style={{ color: app.iconColor.replace('text-', '') }} />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                      {app.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
