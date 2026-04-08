import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { RouteCard } from "@/components/dashboard/RouteCard";

const mockRoutes = [
  {
    id: "1",
    name: "Contact Form",
    channel: "Website Contact",
    recipientEmail: "support@company.com",
    status: "active" as const,
    messageCount: 4523,
  },
  {
    id: "2",
    name: "Newsletter Signup",
    channel: "Marketing",
    recipientEmail: "newsletter@company.com",
    status: "active" as const,
    messageCount: 12847,
  },
  {
    id: "3",
    name: "Quote Request",
    channel: "Sales",
    recipientEmail: "sales@company.com",
    status: "active" as const,
    messageCount: 892,
  },
  {
    id: "4",
    name: "Test Route",
    channel: "Development",
    recipientEmail: "dev@company.com",
    status: "inactive" as const,
    messageCount: 124,
  },
];

export default function Routes() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Routes</h1>
          <p className="text-muted-foreground">
            Configure where your form submissions go.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Route
          </Button>
        </motion.div>
      </div>

      <SearchBar
        placeholder="Search routes..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoutes.map((route, index) => (
          <RouteCard
            key={route.id}
            {...route}
            delay={index * 0.1}
            onEdit={(id) => console.log("Edit", id)}
            onDelete={(id) => console.log("Delete", id)}
            onToggle={(id) => console.log("Toggle", id)}
          />
        ))}
      </div>
    </div>
  );
}
