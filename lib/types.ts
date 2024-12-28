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
  CLICK_ELEMENT = "CLICK_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
}

export enum TaskParamType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export enum TaskParamName {
  Body = "Body",
  ExtractedText = "Extracted text",
  Html = "Html",
  Selector = "Selector",
  TargetUrl = "Target Url",
  Value = "Value",
  WebsiteUrl = "Website Url",

  Timeout = "Timeout (in ms)",

  Visibility = "Visibility",

  WebPage = "Web page",
}

export enum FlowToExecutionPlanError {
  NO_ENTRY_POINT = "NO ENTRY POINT",
  INVALID_INPUTS = "INVALID INPUTS",
  UNEXPECTED = "UNEXPECTED",
}
