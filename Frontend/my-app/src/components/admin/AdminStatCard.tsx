import type { ReactNode } from 'react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export function AdminStatCard({ title, value, icon }: AdminStatCardProps) {
  return (
    <div className="border border-[#1a1714]/10 bg-[#fcfbf8] p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/60">
            {title}
          </p>
          <p className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#1a1714] md:text-4xl">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[#1a1714]/10 text-[#1a1714]/70">
          {icon}
        </div>
      </div>
    </div>
  );
}
