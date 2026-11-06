// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));

afterEach(cleanup);

describe("supplied Board of Directors roster", () => {
  it("renders all 15 supplied names without adding a role where none was provided", async () => {
    const { LeadershipPage } = await import("../client/src/pages/PublicPages");
    render(<LeadershipPage />);
    const roster = screen.getByLabelText("IBAA Board of Directors");
    const cards = within(roster).getAllByRole("article");
    expect(cards).toHaveLength(15);
    for (const name of [
      "Ven. Katusgastota Uparatana",
      "Ven. Dr. Thanat Inthisan",
      "Ven. Dr. Jinwol Lee",
      "Ven. Khenpo Tsultrim Tenzin",
      "Ven. Dr. Dhammadipa",
      "Ven. Thongvanh Dalavong",
      "Bishop Rev. Harada",
      "Ven. Moeng Sang",
      "Ven. Dr. Jongmae Kenneth Park",
      "Ven. Wol",
      "Mrs. Wangmo Dixey",
      "Dr. Richard Dixey",
      "Mr. Prasarn Manakul",
      "Mr. Matthew Regan",
      "Ms. Khin Shwe Myint",
    ]) expect(within(roster).getByRole("heading", { name })).toBeTruthy();
    expect(within(roster).getAllByText("Role not listed in supplied roster")).toHaveLength(4);
    expect(screen.getByText(/Leadership information is maintained by IBAA/i)).toBeTruthy();
  });
});
