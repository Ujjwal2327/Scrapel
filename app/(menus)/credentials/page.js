export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Shield, ShieldOff } from "lucide-react";
import { getUserCredentials } from "@/actions/credentials/getUserCredentials";
import { CreateCredentialDialog } from "./_components/CreateCredentialDialog";
import { CredentialCard } from "./_components/CredentialCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";

export default function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between flex-wrap gap-x-10 gap-y-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <Shield className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe.
          </AlertDescription>
        </Alert>

        <Suspense fallback={<UserCredentialsSkeleton />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

function UserCredentialsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[74px]" />
      ))}
    </div>
  );
}

async function UserCredentials() {
  const credentials = await getUserCredentials();

  if (credentials?.errorMessage)
    return <ErrorAlert message={credentials?.errorMessage} />;

  if (credentials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <div className="flex items-center justify-center rounded-full bg-accent w-20 h-20">
          <ShieldOff size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No credential created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first credential
          </p>
        </div>
        <CreateCredentialDialog triggerText="Create your first credential" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => (
        <CredentialCard key={credential.id} credential={credential} />
      ))}
    </div>
  );
}
