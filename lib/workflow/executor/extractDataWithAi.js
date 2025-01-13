import OpenAI from "openai";
import { TaskParamName } from "@/lib/types";
import { decrypt } from "@/lib/encryption";
import { convertToString } from "@/lib/utils";
import { getCredentialByName } from "@/actions/credentials/getCredentialByName";

export async function extractDataWithAiExecutor(environment) {
  const content = environment.getInput(TaskParamName.Content);
  const model = environment.getInput(TaskParamName.Model);
  const credentialName = environment.getInput(TaskParamName.ApiKey);
  const prompt = environment.getInput(TaskParamName.Prompt);
  const { userId } = environment;

  if (!content) throw new Error(`${TaskParamName.Content} not provided.`);
  if (!model) throw new Error(`${TaskParamName.Model} not defined.`);
  if (!credentialName) throw new Error(`${TaskParamName.ApiKey} not defined.`);
  if (!prompt) throw new Error(`${TaskParamName.Prompt} not defined.`);

  const credential = await getCredentialByName(credentialName, userId);

  if (credential?.errorMessage) throw new Error(credential?.errorMessage);

  const decryptedCredential = await decrypt(credential.value);

  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  if (DEV_MODE) {
    const mockExtractedData = {
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "body > div > form > input.btn.btn-primary",
    };
    environment.setOutput(
      TaskParamName.ExtractedData,
      convertToString(mockExtractedData)
    );

    return;
  }

  let result;

  switch (model) {
    case "gpt-4o-mini":
      result = await usingOpenAi(
        decryptedCredential,
        model,
        content,
        prompt,
        environment
      );
      break;

    default:
      throw new Error(`Invalid AI Model - "${model}".`);
  }

  if (!result) throw new Error("No response from AI.");

  environment.setOutput(TaskParamName.ExtractedData, convertToString(result));
}

async function usingOpenAi(
  decryptedCredential,
  model,
  content,
  prompt,
  environment
) {
  const openai = new OpenAI({
    apiKey: decryptedCredential,
  });

  const response = await openai.chat.completions.create({
    model: model,
    temperature: 1,
    messages: [
      {
        role: "system",
        content:
          "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON object. Work only with the provided content and ensure the output is always a valid JSON object without any surrounding text",
      },
      { role: "user", content: content },
      { role: "user", content: prompt },
    ],
  });

  environment.log.info(`Prompt tokens: ${response.usage.prompt_tokens}`);
  environment.log.info(
    `Completion tokens: ${response.usage.completion_tokens}`
  );

  const result = response.choices[0]?.message.content;
  return result;
}
