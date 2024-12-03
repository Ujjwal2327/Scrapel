import { TriangleAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function ErrorAlert({ message }) {
  return (
    <Alert variant="destructive">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message.slice(0, 200)}</AlertDescription>
    </Alert>
  );
}
