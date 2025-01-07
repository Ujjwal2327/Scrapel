import express from "express";
import { executeWorkflow } from "../lib/workflow/executeWorkflow";

const app = express();
app.use(express.json());

// API endpoint to trigger the worker with dynamic values
app.post("/trigger", async (req, res) => {
  const { executionId, workflowId, nextRunAt } = req.body;

  try {
    if (!executionId || !workflowId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Execute the workflow
    if (!nextRunAt) await executeWorkflow(executionId, workflowId);
    else {
      // Ensure nextRunAt is a valid date
      const nextRunDate = new Date(nextRunAt);
      if (isNaN(nextRunDate)) {
        return res.status(400).json({ error: "Invalid nextRunAt date" });
      }
      await executeWorkflow(executionId, workflowId, nextRunDate);
    }

    return res.status(200).json({ message: "Workflow executed successfully" });
  } catch (error) {
    console.error(
      `Error in worker with executionId: ${executionId}, workflowId: ${workflowId} and nextRunAt: ${nextRunAt}:`,
      error
    );
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Worker is listening on port ${PORT}`);
});
