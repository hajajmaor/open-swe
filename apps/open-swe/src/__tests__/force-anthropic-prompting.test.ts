import { describe, it, expect } from "@jest/globals";
import { GraphConfig } from "@open-swe/shared/open-swe/types";

// Mock function to test the logic from both nodes
function determineIsAnthropicModel(
  modelName: string,
  config: GraphConfig,
): boolean {
  return (
    modelName.includes("claude-") ||
    Boolean(config.configurable?.forceAnthropicPrompting)
  );
}

describe("forceAnthropicPrompting configuration", () => {
  it("should return true for claude models regardless of forceAnthropicPrompting", () => {
    const config = {
      configurable: { forceAnthropicPrompting: false },
    } as GraphConfig;

    expect(
      determineIsAnthropicModel("anthropic:claude-sonnet-4-0", config),
    ).toBe(true);
    expect(determineIsAnthropicModel("anthropic:claude-3-5-haiku", config)).toBe(
      true,
    );
  });

  it("should return false for non-claude models when forceAnthropicPrompting is false", () => {
    const config = {
      configurable: { forceAnthropicPrompting: false },
    } as GraphConfig;

    expect(determineIsAnthropicModel("openai:gpt-4", config)).toBe(false);
    expect(determineIsAnthropicModel("google-genai:gemini-pro", config)).toBe(
      false,
    );
  });

  it("should return true for non-claude models when forceAnthropicPrompting is true", () => {
    const config = {
      configurable: { forceAnthropicPrompting: true },
    } as GraphConfig;

    expect(determineIsAnthropicModel("openai:gpt-4", config)).toBe(true);
    expect(determineIsAnthropicModel("google-genai:gemini-pro", config)).toBe(
      true,
    );
  });

  it("should handle undefined configurable gracefully", () => {
    const config = {} as GraphConfig;

    expect(determineIsAnthropicModel("openai:gpt-4", config)).toBe(false);
    expect(
      determineIsAnthropicModel("anthropic:claude-sonnet-4-0", config),
    ).toBe(true);
  });

  it("should handle undefined forceAnthropicPrompting gracefully", () => {
    const config = {
      configurable: {},
    } as GraphConfig;

    expect(determineIsAnthropicModel("openai:gpt-4", config)).toBe(false);
    expect(
      determineIsAnthropicModel("anthropic:claude-sonnet-4-0", config),
    ).toBe(true);
  });

  it("should work with OpenAI-compatible endpoints using Claude models", () => {
    const config = {
      configurable: { forceAnthropicPrompting: true },
    } as GraphConfig;

    // These would be accessed through OpenAI-compatible providers like OpenRouter
    expect(determineIsAnthropicModel("openai:claude-3-5-sonnet", config)).toBe(
      true,
    );
    expect(determineIsAnthropicModel("openai:claude-3-opus", config)).toBe(
      true,
    );
  });
});