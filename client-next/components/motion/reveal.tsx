"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Motion Wrapper pattern from the migration blueprint (§4 / §11 Phase 1
// scope): the ONLY Client Component boundary needed for otherwise-static
// sections that use framer-motion purely for entrance animation. Wrapping
// a <Reveal> around static server-rendered markup keeps the surrounding
// page a Server Component while still preserving the exact same
// whileInView/initial/animate/transition behavior as the original
// framer-motion usage.
export function Reveal({ children, ...motionProps }: HTMLMotionProps<"div">) {
  return <motion.div {...motionProps}>{children}</motion.div>;
}
