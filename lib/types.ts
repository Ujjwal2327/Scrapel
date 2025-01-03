export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TaskType {
  ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  NAVIGATE_URL = "NAVIGATE_URL",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
  SCROLL_TO_ELEMENT = "SCROLL_TO_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
}

export enum TaskParamType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  CREDENTIAL = "CREDENTIAL",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export enum TaskParamName {
  Body = "Body",
  Content = "Content",
  ExtractedData = "Extracted data",
  ExtractedText = "Extracted text",
  Html = "Html",
  Json = "Json",
  Prompt = "Prompt",
  PropertyName = "Property name",
  PropertyValue = "Property value",
  Selector = "Selector",
  TargetUrl = "Target Url",
  Url = "Url",
  Value = "Value",
  WebsiteUrl = "Website Url",

  Timeout = "Timeout (in ms)",

  Model = "Model",
  Visibility = "Visibility",

  ApiKey = "Api Key",
  Credential = "Credential",

  WebPage = "Web page",
}

export enum FlowToExecutionPlanError {
  NO_ENTRY_POINT = "NO ENTRY POINT",
  INVALID_INPUTS = "INVALID INPUTS",
  UNEXPECTED = "UNEXPECTED",
}

export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}
