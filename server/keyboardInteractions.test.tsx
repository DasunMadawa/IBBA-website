// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({
  Link: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(({ href, children, onClick, ...props }, ref) => <a ref={ref} href={href} onClick={event => { event.preventDefault(); onClick?.(event); }} {...props}>{children}</a>),
  useLocation: () => ["/", vi.fn()],
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: 1, name: "IBAA Owner", role: "admin" }, loading: false, isAuthenticated: true }),
}));

vi.mock("@/components/DashboardLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const invalidate = vi.fn(async () => undefined);
const mutation = () => ({ mutate: vi.fn(), isPending: false });

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      content: { adminList: { invalidate }, listPublished: { invalidate } },
      media: { adminList: { invalidate } },
    }),
    content: {
      adminList: { useQuery: () => ({
        data: [{
          id: 42,
          title: "Keyboard QA entry",
          slug: "keyboard-qa-entry",
          excerpt: "A verified keyboard test entry.",
          body: "This body is long enough for the administrator validation flow.",
          contentType: "news",
          status: "draft",
          authorName: "IBAA Editorial Team",
          publishedAt: null,
          youtubeUrl: null,
          youtubeTitle: null,
          featuredMediaId: null,
          attachments: [],
          legacyUrl: null,
          categories: ["News"],
          updatedAt: Date.now(),
        }],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }) },
      save: { useMutation: mutation },
      setStatus: { useMutation: mutation },
      remove: { useMutation: mutation },
    },
    media: {
      adminList: { useQuery: () => ({
        data: [{ id: 7, mediaKind: "document", originalName: "minutes.pdf", caption: "Study Circle minutes", url: "/minutes.pdf", altText: null }],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      }) },
    },
  },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  window.scrollTo = vi.fn();
});

describe("keyboard interaction contracts", () => {
  it("opens and closes the collapsed menu with Enter, Space, and link activation", async () => {
    const { SiteHeader } = await import("../client/src/components/site/SiteHeader");
    const user = userEvent.setup();
    render(<SiteHeader />);

    const menu = screen.getByRole("button", { name: "Menu" });
    menu.focus();
    expect(document.activeElement).toBe(menu);
    await user.keyboard("{Enter}");
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Primary navigation" }).classList.contains("is-open")).toBe(true);

    await user.tab();
    const home = screen.getByRole("link", { name: "Home" });
    expect(document.activeElement).toBe(home);
    await user.keyboard("{Enter}");
    expect(menu.getAttribute("aria-expanded")).toBe("false");

    menu.focus();
    await user.keyboard(" ");
    expect(menu.getAttribute("aria-expanded")).toBe("true");

    const outreach = screen.getByRole("link", { name: "Temple Outreach" });
    expect(outreach.getAttribute("href")).toBe("/temple-outreach");
    outreach.focus();
    await user.keyboard("{Enter}");
    expect(menu.getAttribute("aria-expanded")).toBe("false");
  });

  it("traverses admin fields, exposes validation, toggles attachments, and manages dialog focus", async () => {
    const { AdminContentPage } = await import("../client/src/pages/AdminPages");
    const user = userEvent.setup();
    render(<AdminContentPage />);

    const title = screen.getByLabelText("Title");
    title.focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("URL slug"));

    const attachment = screen.getByRole("checkbox", { name: /minutes\.pdf/i });
    attachment.focus();
    await user.keyboard(" ");
    expect((attachment as HTMLInputElement).checked).toBe(true);

    const create = screen.getByRole("button", { name: "Create entry" });
    create.focus();
    await user.keyboard("{Enter}");
    expect((await screen.findByText("Enter a title with at least 3 characters.")).getAttribute("role")).toBe("alert");
    expect(document.activeElement).toBe(title);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    deleteButton.focus();
    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("alertdialog", { name: "Delete this entry?" });
    expect(document.body.contains(dialog)).toBe(true);

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = screen.getByRole("button", { name: "Delete entry" });
    expect([cancel, confirm]).toContain(document.activeElement);
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(document.activeElement).toBe(deleteButton);
  });
});
