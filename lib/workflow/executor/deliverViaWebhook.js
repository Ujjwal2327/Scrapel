import { TaskParamName } from "@/lib/types";

// Sends a POST request to the target URL and logs the response body if successful.
export async function deliverViaWebhookExecutor(environment) {
  const targetUrl = environment.getInput(TaskParamName.TargetUrl);
  const body = environment.getInput(TaskParamName.Body);

  if (!targetUrl) throw new Error(`${TaskParamName.TargetUrl} not provided.`);
  if (!body) throw new Error(`${TaskParamName.Body} not provided.`);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const statusCode = response.status;
  if (statusCode !== 200) throw new Error(`Status code: ${statusCode}`);

  const responseBody = await response.json();
  environment.log.info(JSON.stringify(responseBody));
}
