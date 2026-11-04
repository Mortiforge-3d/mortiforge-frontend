interface AdminStatsProps {
  revenue: number;
  orders: number;
  pendingOrders: number;
  customers: number;
}

export default function AdminStats({
  revenue,
  orders,
  pendingOrders,
  customers,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
    },
    {
      label: "Orders",
      value: orders.toLocaleString("en-IN"),
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toLocaleString("en-IN"),
    },
    {
      label: "Customers",
      value: customers.toLocaleString("en-IN"),
    },
  ];

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

          <p className="heading-font mt-4 text-4xl break-words">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}