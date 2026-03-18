// import { motion } from "framer-motion";
// import { CheckCircle, Wallet, TrendingUp, Zap } from "lucide-react";

// interface StartSmartInvestBetterProps {
//   isDarkMode: boolean;
// }

// const steps = [
//   {
//     step: 1,
//     title: "Easy Onboarding",
//     description: "Register and verify your account in minutes.",
//     icon: CheckCircle,
//   },
//   {
//     step: 2,
//     title: "Smart Investments",
//     description: "Fund your account and choose the right investment index.",
//     icon: Wallet,
//   },
//   {
//     step: 3,
//     title: "Achieve More",
//     description: "Grow your portfolio with confidence and transparency.",
//     icon: TrendingUp,
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.2,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   },
// };

// export function StartSmartInvestBetter({
//   isDarkMode,
// }: StartSmartInvestBetterProps) {
//   const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-700";
//   const cardBg = isDarkMode
//     ? "bg-slate-800/40 border-slate-700/50"
//     : "bg-white/90 border-slate-300/70 shadow-md";
//   const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

//   return (
//     <section
//       className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
//         isDarkMode
//           ? "bg-gradient-to-b from-slate-900 via-cyan-950/20 to-slate-900"
//           : "bg-gradient-to-b from-slate-100 via-cyan-50/20 to-slate-100"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* Badge */}
//         <motion.div
//           className="flex justify-center mb-8"
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.5 }}
//         >
//           <div
//             className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
//               isDarkMode
//                 ? "bg-cyan-500/10 border-cyan-500/30"
//                 : "bg-cyan-100/80 border-cyan-400/50 shadow-sm"
//             }`}
//           >
//             <Zap className="w-4 h-4 text-cyan-500" />
//             <span className="text-sm font-semibold text-cyan-500">
//               How It Works
//             </span>
//           </div>
//         </motion.div>

//         {/* Heading */}
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
//         >
//           <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
//             Start Smart,{" "}
//             <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
//               Invest Better!
//             </span>
//           </h2>
//           <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
//             No trading experience? No problem. Our ready-made strategies align
//             with your goals and minimize risk.
//           </p>
//         </motion.div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left: Illustration */}
//           <motion.div
//             className="flex justify-center items-center"
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
//             <motion.div
//               className={`relative w-full h-80 sm:h-96 rounded-2xl border backdrop-blur-sm overflow-hidden ${cardBg}`}
//               whileHover={{ scale: 1.02, y: -8 }}
//               transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
//             >
//               {/* Gradient Illustration Background */}
//               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent" />

//               {/* SVG Illustration - Digital Dashboard Theme */}
//               <svg
//                 viewBox="0 0 400 400"
//                 className="w-full h-full"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 {/* Background Circle */}
//                 <circle
//                   cx="200"
//                   cy="200"
//                   r="180"
//                   fill={
//                     isDarkMode
//                       ? "rgba(15, 23, 42, 0.5)"
//                       : "rgba(248, 250, 252, 0.5)"
//                   }
//                   opacity="0.6"
//                 />

//                 {/* Floating Cards */}
//                 <g opacity="0.8">
//                   {/* Card 1 - Top Left */}
//                   <rect
//                     x="50"
//                     y="80"
//                     width="120"
//                     height="80"
//                     rx="12"
//                     fill={isDarkMode ? "#1e293b" : "#f1f5f9"}
//                     stroke={isDarkMode ? "#475569" : "#cbd5e1"}
//                     strokeWidth="2"
//                   />
//                   <circle cx="75" cy="105" r="4" fill="#06b6d4" />
//                   <circle cx="75" cy="120" r="3" fill="#06b6d4" opacity="0.6" />
//                   <circle cx="75" cy="135" r="3" fill="#06b6d4" opacity="0.4" />
//                   <line
//                     x1="90"
//                     y1="100"
//                     x2="155"
//                     y2="100"
//                     stroke={isDarkMode ? "#94a3b8" : "#cbd5e1"}
//                     strokeWidth="2"
//                   />
//                   <line
//                     x1="90"
//                     y1="115"
//                     x2="155"
//                     y2="115"
//                     stroke={isDarkMode ? "#94a3b8" : "#cbd5e1"}
//                     strokeWidth="1.5"
//                   />
//                   <line
//                     x1="90"
//                     y1="130"
//                     x2="155"
//                     y2="130"
//                     stroke={isDarkMode ? "#94a3b8" : "#cbd5e1"}
//                     strokeWidth="1.5"
//                   />
//                 </g>

//                 {/* Card 2 - Top Right */}
//                 <g opacity="0.8">
//                   <rect
//                     x="230"
//                     y="90"
//                     width="120"
//                     height="80"
//                     rx="12"
//                     fill={isDarkMode ? "#1e293b" : "#f1f5f9"}
//                     stroke={isDarkMode ? "#475569" : "#cbd5e1"}
//                     strokeWidth="2"
//                   />
//                   <polyline
//                     points="250,150 265,120 280,135 295,100 310,125 325,95 340,140"
//                     fill="none"
//                     stroke="#0ea5e9"
//                     strokeWidth="2"
//                   />
//                 </g>

//                 {/* Center Growing Graph */}
//                 <g opacity="0.9">
//                   <rect
//                     x="120"
//                     y="200"
//                     width="160"
//                     height="120"
//                     rx="16"
//                     fill={isDarkMode ? "#164e63" : "#cffafe"}
//                     opacity="0.2"
//                     stroke="#06b6d4"
//                     strokeWidth="2"
//                   />
//                   <polyline
//                     points="140,300 160,260 180,280 200,220 220,250 240,180 260,210 280,140"
//                     fill="none"
//                     stroke="#06b6d4"
//                     strokeWidth="3"
//                   />
//                   <circle cx="140" cy="300" r="4" fill="#06b6d4" />
//                   <circle cx="280" cy="140" r="5" fill="#0ea5e9" />
//                 </g>

//                 {/* Wallet Icon - Bottom Right */}
//                 <g opacity="0.7">
//                   <rect
//                     x="260"
//                     y="280"
//                     width="80"
//                     height="70"
//                     rx="10"
//                     fill={isDarkMode ? "#1e293b" : "#f1f5f9"}
//                     stroke={isDarkMode ? "#475569" : "#cbd5e1"}
//                     strokeWidth="2"
//                   />
//                   <rect
//                     x="275"
//                     y="295"
//                     width="50"
//                     height="30"
//                     rx="6"
//                     fill="none"
//                     stroke="#10b981"
//                     strokeWidth="2"
//                   />
//                   <circle cx="315" cy="315" r="3" fill="#10b981" />
//                 </g>

//                 {/* Decorative Dots */}
//                 <circle cx="100" cy="320" r="2" fill="#0ea5e9" opacity="0.5" />
//                 <circle cx="320" cy="260" r="2" fill="#0ea5e9" opacity="0.5" />
//                 <circle cx="200" cy="80" r="2" fill="#06b6d4" opacity="0.3" />
//               </svg>

//               {/* Animated Glow */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 to-cyan-500/5"
//                 animate={{ opacity: [0, 1, 0] }}
//                 transition={{ duration: 3, repeat: Infinity }}
//               />
//             </motion.div>
//           </motion.div>

//           {/* Right: Steps */}
//           <motion.div
//             className="space-y-6"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//           >
//             {steps.map((stepItem, index) => {
//               const Icon = stepItem.icon;
//               return (
//                 <motion.div
//                   key={index}
//                   className={`relative p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 group hover:scale-105 cursor-pointer ${cardBg}`}
//                   // variants={itemVariants}
//                   whileHover={{ x: 8 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

//                   <div className="relative z-10 flex items-start gap-4 sm:gap-6">
//                     {/* Step Number Badge */}
//                     <motion.div
//                       className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
//                       whileHover={{ scale: 1.1, rotate: 5 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {stepItem.step}
//                     </motion.div>

//                     {/* Content */}
//                     <div className="flex-1 pt-1">
//                       <h3
//                         className={`text-xl sm:text-2xl font-bold mb-2 ${textColor}`}
//                       >
//                         {stepItem.title}
//                       </h3>
//                       <p
//                         className={`${mutedClasses} text-sm sm:text-base leading-relaxed`}
//                       >
//                         {stepItem.description}
//                       </p>
//                     </div>

//                     {/* Icon */}
//                     <motion.div
//                       className="flex-shrink-0 text-cyan-500 mt-2"
//                       whileHover={{ scale: 1.2, rotate: -10 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>

//         {/* Bottom CTA Text */}
//         <motion.div
//           className="mt-16 text-center"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.8, duration: 0.6 }}
//         >
//           <p
//             className={`${mutedClasses} text-sm sm:text-base max-w-2xl mx-auto`}
//           >
//             Join thousands of investors who trust our platform to manage their
//             investments with confidence.
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

















import { motion } from "framer-motion";
import { CheckCircle, Wallet, TrendingUp, Zap } from "lucide-react";

interface StartSmartInvestBetterProps {
  isDarkMode: boolean;
}

const steps = [
  {
    step: 1,
    title: "Quick Setup",
    description: "Sign up and complete verification in minutes.",
    icon: CheckCircle,
  },
  {
    step: 2,
    title: "Invest Smartly",
    description: "Add funds and select investment options that match your goals.",
    icon: Wallet,
  },
  {
    step: 3,
    title: "Track Your Growth",
    description: "Monitor your progress and grow your wealth with confidence.",
    icon: TrendingUp,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function StartSmartInvestBetter({
  isDarkMode,
}: StartSmartInvestBetterProps) {
  const mutedClasses = isDarkMode ? "text-[#B8C8D8]" : "text-slate-700";
  const cardBg = isDarkMode
    ? "bg-[#0F2137]/60 border-white/10"
    : "bg-white/90 border-slate-300/70 shadow-md";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#0A1628]/50 via-[#0A1628]/50 to-[#0A1628]/50"
          : "bg-gradient-to-b from-slate-100/50 via-amber-50/10 to-slate-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
              isDarkMode
                ? "bg-[#C9A84C]/10 border-[#C9A84C]/30"
                : "bg-amber-100/80 border-amber-400/50 shadow-sm"
            }`}
          >
            <Zap className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-sm font-semibold text-[#C9A84C]">
              How It Works
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Start Smart,{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E2BC6A] bg-clip-text text-transparent">
              Invest Better!
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            No trading experience? No problem. Our ready-made strategies align
            with your goals and minimize risk.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Illustration */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className={`relative w-full h-80 sm:h-96 rounded-2xl border backdrop-blur-sm overflow-hidden ${cardBg}`}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            >
              <img
               
                src="/img.jpeg"
                alt="Investment illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Right: Steps */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              return (
                <motion.div
                  key={index}
                  className={`relative p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 group hover:scale-105 cursor-pointer ${cardBg}`}
                  // variants={itemVariants}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#C9A84C]/0 to-[#E2BC6A]/0 group-hover:from-[#C9A84C]/10 group-hover:to-[#E2BC6A]/10 transition-all duration-300" />

                  <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                    {/* Step Number Badge */}
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8893C] flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stepItem.step}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3
                        className={`text-xl sm:text-2xl font-bold mb-2 ${textColor}`}
                      >
                        {stepItem.title}
                      </h3>
                      <p
                        className={`${mutedClasses} text-sm sm:text-base leading-relaxed`}
                      >
                        {stepItem.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="flex-shrink-0 text-[#C9A84C] mt-2"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom CTA Text */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p
            className={`${mutedClasses} text-sm sm:text-base max-w-2xl mx-auto`}
          >
            Join thousands of investors who trust our platform to manage their
            investments with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}