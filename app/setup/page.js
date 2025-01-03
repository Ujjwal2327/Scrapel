export const dynamic = "force-dynamic";
import { setupUser } from "@/actions/user/setupUser";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";

export default async function SetupPage() {
  const response = await setupUser().catch((error) => {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;

    return { errorMessage: error.message };
  });

  if (response.errorMessage)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Logo iconSize={50} fontSize="text-4xl" />
        <Separator className="max-w-xs" />
        <div className="max-w-xs">
          <ErrorAlert message={response.errorMessage} />
        </div>
      </div>
    );
}
