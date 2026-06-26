// === METADATA ===
// Purpose: Pin the Workflow Tools product config — fixed 30 SAR price, honest USD
//          derivation, and the checkout-link configured/unconfigured behavior.
// Tests:   npm test -- -t workflow-tools
// === END METADATA ===
import { describe, it, expect, afterEach } from "vitest"
import {
  WORKFLOW_TOOLS,
  WORKFLOW_TOOLS_PRICE_SAR,
  WORKFLOW_TOOLS_PRICE_USD,
  workflowToolsCheckoutUrl,
  isWorkflowToolsCheckoutConfigured,
} from "@/lib/workflow-tools/config"
import { SAR_PER_USD } from "@/lib/subscribe/config"

const ORIGINAL = process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS
  else process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS = ORIGINAL
})

describe("workflow-tools · price", () => {
  it("is locked at 30 SAR", () => {
    expect(WORKFLOW_TOOLS_PRICE_SAR).toBe(30)
    expect(WORKFLOW_TOOLS.priceSar).toBe(30)
  })

  it("derives USD honestly from the repo SAR/USD rate", () => {
    expect(WORKFLOW_TOOLS_PRICE_USD).toBe(Math.round(30 / SAR_PER_USD))
    expect(WORKFLOW_TOOLS.priceUsd).toBe(WORKFLOW_TOOLS_PRICE_USD)
  })
})

describe("workflow-tools · checkout link", () => {
  it("is unconfigured (empty) when the env var is absent", () => {
    delete process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS
    expect(workflowToolsCheckoutUrl()).toBe("")
    expect(isWorkflowToolsCheckoutConfigured()).toBe(false)
  })

  it("trims and reports configured when the env var is set", () => {
    process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS = "  https://hamzahramli.gumroad.com/l/wflow  "
    expect(workflowToolsCheckoutUrl()).toBe("https://hamzahramli.gumroad.com/l/wflow")
    expect(isWorkflowToolsCheckoutConfigured()).toBe(true)
  })
})
