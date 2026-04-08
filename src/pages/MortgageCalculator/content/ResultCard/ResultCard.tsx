type ResultCardProps = {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
};

export default function ResultCard(props: ResultCardProps) {
  const { label, value, color, subtitle } = props;

  return (
    <div className={`rounded-xl border ${color} p-5 flex flex-col gap-1`}>
      <span className='text-xs font-semibold uppercase tracking-wider opacity-60'>{label}</span>
      <span className='text-2xl font-bold'>{value}</span>
      {subtitle && <span className='text-xs opacity-50 mt-1'>{subtitle}</span>}
    </div>
  );
}
