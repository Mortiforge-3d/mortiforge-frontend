const stats = [
  {
    label: "Total Orders",
    value: "0",
  },
  {
    label: "Custom Requests",
    value: "0",
  },
  {
    label: "Pending Orders",
    value: "0",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-border bg-card/40 p-6 backdrop-blur"
        >
          <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {stat.label}
          </p>

          <p className="heading-font mt-4 text-5xl">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}