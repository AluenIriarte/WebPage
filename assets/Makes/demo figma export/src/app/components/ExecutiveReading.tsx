interface ExecutiveReadingProps {
  insights: string[];
}

export function ExecutiveReading({ insights }: ExecutiveReadingProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-lg p-4 border border-[#7111DF]/10">
      <div className="text-[#14131A] text-sm mb-3 tracking-tight">Lectura ejecutiva</div>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-[#6E6A7A] text-xs leading-relaxed flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-[#7111DF] mt-1.5 flex-shrink-0" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}