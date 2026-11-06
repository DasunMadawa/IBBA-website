// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ data: [] as Array<Record<string, any>>, isError: false }));

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    meetingMinutes: {
      listPublished: { useQuery: () => ({ data: state.data, isLoading: false, isError: state.isError, error: state.isError ? new Error("Unavailable") : null, refetch: vi.fn() }) },
    },
  },
}));

afterEach(() => { cleanup(); state.data = []; state.isError = false; });

describe("Study Circles written meeting records", () => {
  it("renders an honest empty state without placeholder meeting content", async () => {
    const { WrittenMeetingRecords } = await import("../client/src/pages/MeetingMinutesPublic");
    render(<WrittenMeetingRecords />);
    expect(screen.getByRole("heading", { name: "No managed Meeting Minutes are published yet" })).toBeTruthy();
    expect(screen.getByText(/Written minutes will appear here after an authorized IBAA editor/i)).toBeTruthy();
  });

  it("preserves written minutes as the primary record with optional photo and privacy-enhanced video", async () => {
    state.data = [{
      id: 1,
      slug: "august-dharma-meeting",
      title: "August Dharma Meeting Minutes",
      meetingDate: Date.UTC(2026, 7, 15, 12),
      hostTemple: "Example Temple",
      locationLabel: "Washington, DC",
      summary: "A concise verified meeting summary.",
      minutesBody: "Opening reflection\nKey discussion\nAgreed next steps",
      traditions: ["Theravada", "Mahayana", "Vajrayana"],
      photo: { url: "/group.webp", altText: "Participants gathered after the Dharma meeting.", caption: "Group photo after the meeting." },
      youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
      youtubeTitle: "August Dharma Meeting recording",
    }];
    const { WrittenMeetingRecords, MinutesCard } = await import("../client/src/pages/MeetingMinutesPublic");
    render(<WrittenMeetingRecords />);
    expect(screen.getByRole("link", { name: /Read the written minutes/i }).getAttribute("href")).toBe("/study-circles/minutes/august-dharma-meeting");
    cleanup();
    render(<MinutesCard entry={state.data[0]} />);
    const writtenHeading = screen.getByRole("heading", { name: "Meeting Minutes" });
    const frame = screen.getByTitle("August Dharma Meeting recording");
    expect(writtenHeading.compareDocumentPosition(frame) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(frame.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(screen.getByAltText("Participants gathered after the Dharma meeting.")).toBeTruthy();
    expect(screen.getByText(/Agreed next steps/)).toBeTruthy();
  });
});
