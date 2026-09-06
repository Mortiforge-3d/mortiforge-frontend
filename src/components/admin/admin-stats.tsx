const stats = [
  {
    label: "Revenue",
    value: "—",
  },
  {
    label: "Orders",
    value: "—",
  },
  {
    label: "Pending Orders",
    value: "—",
  },
  {
    label: "Customers",
    value: "—",
  },
];

export default function AdminStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur"
        >
          <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {stat.label}
          </p>

          <p className="heading-font mt-4 text-5xl">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}