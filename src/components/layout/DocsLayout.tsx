import { PublicNavbar } from "./PublicNavbar";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex pt-16">{children}</div>
    </div>
  );
}
