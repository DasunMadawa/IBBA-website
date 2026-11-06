// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    contact: {
      submit: {
        useMutation: (options: { onSuccess: (result: { success: true; reference: string }) => void }) => ({
          mutate: vi.fn(() => options.onSuccess({ success: true, reference: "IBAA-84" })),
          isPending: false,
        }),
      },
    },
  },
}));

describe("public contact form", () => {
  it("validates fields and presents the private-queue confirmation reference", async () => {
    const { ContactPage } = await import("../client/src/pages/ContactPages");
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.click(screen.getByRole("button", { name: "Send inquiry" }));
    expect(screen.getByText("Enter your name.")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();

    await user.type(screen.getByLabelText("Name *"), "Community Visitor");
    await user.type(screen.getByLabelText("Email *"), "visitor@example.com");
    await user.type(screen.getByLabelText("Message *"), "I would like to learn more about IBAA community participation.");
    await user.click(screen.getByRole("button", { name: "Send inquiry" }));

    expect(screen.getByRole("heading", { name: "Inquiry received" })).toBeTruthy();
    expect(screen.getByText("IBAA-84")).toBeTruthy();
    expect(screen.getByText(/administrator can review the message in the private inquiry queue/i)).toBeTruthy();
  });
});
