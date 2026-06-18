/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function MovieCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col bg-white dark:bg-vibrant-card-dark border border-zinc-150 dark:border-white/5 rounded-2xl overflow-hidden shadow-xs p-3 space-y-3.5 select-none"
    >
      {/* Poster Image space */}
      <div className="relative aspect-[2/3] w-full bg-zinc-200 dark:bg-[#1E1E21] animate-pulse rounded-xl" />

      {/* Details layout container */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Genre Category pill placeholder */}
          <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800/50 animate-pulse rounded-md" />
          {/* Release Date placeholder */}
          <div className="h-2 w-1/5 bg-zinc-200 dark:bg-zinc-800/50 animate-pulse rounded-md" />
        </div>

        {/* Title placeholder */}
        <div className="h-4.5 w-11/12 bg-zinc-200 dark:bg-zinc-800/80 animate-pulse rounded-md" />
      </div>
    </motion.div>
  );
}
