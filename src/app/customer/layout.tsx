export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="pt-8">{children}</div>;
}