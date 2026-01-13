import React from 'react';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
interface ManualCardProps {
  title: string;
  description: string;
  size: string;
  delay?: number;
}
export function ManualCard({
  title,
  description,
  size,
  delay = 0
}: ManualCardProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5,
    delay
  }} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
          <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {size}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6 line-clamp-2">{description}</p>

      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all group/btn">
        <Download size={16} />
        Download PDF
        <ArrowRight size={16} className="opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
      </button>
    </motion.div>;
}