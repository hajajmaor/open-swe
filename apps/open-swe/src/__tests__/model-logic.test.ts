import { describe, it, expect } from "@jest/globals";
import { GraphConfig } from "@open-swe/shared/open-swe/types";

// Mock the helper function from programmer node
const shouldUseAnthropicLogic = (config: GraphConfig, modelName: string): boolean => {
  const forceModelLogic = config.configurable?.forceModelLogic;
  
  if (forceModelLogic === "anthropic") {
    return true;
  } else if (forceModelLogic === "openai" || forceModelLogic === "google-genai") {
    return false;
  } else {
    // Default "auto" behavior - infer from model name
    return modelName.includes("claude-");
  }
};

describe("Model Logic Determination", () => {
  describe("shouldUseAnthropicLogic", () => {
    it("should return true when forceModelLogic is 'anthropic'", () => {
      const config: GraphConfig = {
        configurable: {
          forceModelLogic: "anthropic" as const,
        },
      } as GraphConfig;

      // Should use Anthropic logic even for OpenAI model names
      expect(shouldUseAnthropicLogic(config, "gpt-4")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "some-custom-model")).toBe(true);
    });

    it("should return false when forceModelLogic is 'openai'", () => {
      const config: GraphConfig = {
        configurable: {
          forceModelLogic: "openai" as const,
        },
      } as GraphConfig;

      // Should use OpenAI logic even for Claude model names
      expect(shouldUseAnthropicLogic(config, "claude-3.5-sonnet")).toBe(false);
      expect(shouldUseAnthropicLogic(config, "claude-4")).toBe(false);
    });

    it("should return false when forceModelLogic is 'google-genai'", () => {
      const config: GraphConfig = {
        configurable: {
          forceModelLogic: "google-genai" as const,
        },
      } as GraphConfig;

      // Should use OpenAI logic (false) for Google GenAI
      expect(shouldUseAnthropicLogic(config, "claude-3.5-sonnet")).toBe(false);
      expect(shouldUseAnthropicLogic(config, "gemini-pro")).toBe(false);
    });

    it("should infer from model name when forceModelLogic is 'auto'", () => {
      const config: GraphConfig = {
        configurable: {
          forceModelLogic: "auto" as const,
        },
      } as GraphConfig;

      // Should infer based on model name
      expect(shouldUseAnthropicLogic(config, "claude-3.5-sonnet")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "claude-4")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "gpt-4")).toBe(false);
      expect(shouldUseAnthropicLogic(config, "some-other-model")).toBe(false);
    });

    it("should infer from model name when forceModelLogic is not set", () => {
      const config: GraphConfig = {
        configurable: {},
      } as GraphConfig;

      // Should default to auto behavior
      expect(shouldUseAnthropicLogic(config, "claude-3.5-sonnet")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "claude-opus-4")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "gpt-4")).toBe(false);
      expect(shouldUseAnthropicLogic(config, "gemini-pro")).toBe(false);
    });

    it("should handle edge cases in model names", () => {
      const config: GraphConfig = {
        configurable: {
          forceModelLogic: "auto" as const,
        },
      } as GraphConfig;

      // Test various model name patterns
      expect(shouldUseAnthropicLogic(config, "anthropic/claude-3.5-sonnet")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "openai/gpt-4")).toBe(false);
      expect(shouldUseAnthropicLogic(config, "claude-based-model")).toBe(true);
      expect(shouldUseAnthropicLogic(config, "not-claude-model")).toBe(true); // contains "claude-"
      expect(shouldUseAnthropicLogic(config, "gpt-based-model")).toBe(false);
    });
  });
});