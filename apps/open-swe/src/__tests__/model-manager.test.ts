import { describe, it, expect } from "@jest/globals";
import { ModelManager } from "../utils/llms/model-manager.js";
import { LLMTask } from "@open-swe/shared/open-swe/llm-task";
import { GraphConfig } from "@open-swe/shared/open-swe/types";

describe("ModelManager Configuration Support", () => {
  let modelManager: ModelManager;

  beforeEach(() => {
    modelManager = new ModelManager();
  });

  describe("getModelNameForTask with custom OpenAI models", () => {
    it("should return custom model name when using custom OpenAI endpoint", () => {
      const config: GraphConfig = {
        configurable: {
          plannerModelName: "openai:gpt-4",
          openAIBaseUrl: "https://api.openrouter.ai/api/v1",
          openAIPlannerModelName: "anthropic/claude-3.5-sonnet",
        },
      } as GraphConfig;

      const modelName = modelManager.getModelNameForTask(config, LLMTask.PLANNER);
      
      // Should return the custom model name for OpenAI provider with custom base URL
      expect(modelName).toBe("anthropic/claude-3.5-sonnet");
    });

    it("should return default model name when no custom OpenAI endpoint is set", () => {
      const config: GraphConfig = {
        configurable: {
          plannerModelName: "openai:gpt-4",
          openAIPlannerModelName: "anthropic/claude-3.5-sonnet", // This should be ignored
        },
      } as GraphConfig;

      const modelName = modelManager.getModelNameForTask(config, LLMTask.PLANNER);
      
      // Should return the standard model name since no custom base URL is set
      expect(modelName).toBe("gpt-4");
    });

    it("should return default model name when custom OpenAI model name is not provided", () => {
      const config: GraphConfig = {
        configurable: {
          plannerModelName: "openai:gpt-4",
          openAIBaseUrl: "https://api.openrouter.ai/api/v1",
          // No openAIPlannerModelName provided
        },
      } as GraphConfig;

      const modelName = modelManager.getModelNameForTask(config, LLMTask.PLANNER);
      
      // Should return the standard model name since no custom model name is provided
      expect(modelName).toBe("gpt-4");
    });

    it("should work correctly for different tasks", () => {
      const config: GraphConfig = {
        configurable: {
          programmerModelName: "openai:gpt-4",
          reviewerModelName: "openai:gpt-3.5-turbo",
          openAIBaseUrl: "https://api.openrouter.ai/api/v1",
          openAIProgrammerModelName: "anthropic/claude-3.5-sonnet",
          openAIReviewerModelName: "anthropic/claude-3.5-haiku",
        },
      } as GraphConfig;

      const programmerModel = modelManager.getModelNameForTask(config, LLMTask.PROGRAMMER);
      const reviewerModel = modelManager.getModelNameForTask(config, LLMTask.REVIEWER);
      
      expect(programmerModel).toBe("anthropic/claude-3.5-sonnet");
      expect(reviewerModel).toBe("anthropic/claude-3.5-haiku");
    });

    it("should not affect non-OpenAI providers", () => {
      const config: GraphConfig = {
        configurable: {
          plannerModelName: "anthropic:claude-sonnet-4-0",
          openAIBaseUrl: "https://api.openrouter.ai/api/v1",
          openAIPlannerModelName: "some-other-model", // This should be ignored for Anthropic
        },
      } as GraphConfig;

      const modelName = modelManager.getModelNameForTask(config, LLMTask.PLANNER);
      
      // Should return the standard Anthropic model name, ignoring OpenAI custom settings
      expect(modelName).toBe("claude-sonnet-4-0");
    });
  });
});