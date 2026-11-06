// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Organization = {
  name: string;
  address: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  website?: string;
};

type Individual = {
  name: string;
  location: string;
};

type MemberSource = {
  suppliedOn: string;
  organizations: Organization[];
  individuals: Individual[];
};

const submittedOrganizations: readonly Organization[] = [
  { name: "Katog Choling", address: "45 NC 8641, Parthenon, AR 72666", street: "45 NC 8641", city: "Parthenon", state: "AR", postalCode: "72666", website: "https://katog.org" },
  { name: "Jodo Shinshu International Office", address: "2140 Durant Ave, Berkeley, CA 94704", street: "2140 Durant Ave", city: "Berkeley", state: "CA", postalCode: "94704", website: "https://www.bcahq.org" },
  { name: "Jungto Society", address: "4361 Aitcheson Rd, Beltsville, MD 20705", street: "4361 Aitcheson Rd", city: "Beltsville", state: "MD", postalCode: "20705", website: "https://www.jungto.org" },
  { name: "Wat Khmer", address: "24304 S 189th Ave, Buckeye, AZ 85326", street: "24304 S 189th Ave", city: "Buckeye", state: "AZ", postalCode: "85326" },
  { name: "Honpa Hongwanji", address: "1727 Pali Highway, Honolulu, HI 96813", street: "1727 Pali Highway", city: "Honolulu", state: "HI", postalCode: "96813", website: "https://honpahi.org" },
  { name: "Wat Khmer Kampuchea Krom", address: "66 Sunset Court, San Jose, CA 95116", street: "66 Sunset Court", city: "San Jose", state: "CA", postalCode: "95116" },
  { name: "Mettananda Vihara (Myanmar American Buddhist Association)", address: "2707 Seminary Ave, Oakland, CA 94605", street: "2707 Seminary Ave", city: "Oakland", state: "CA", postalCode: "94605" },
  { name: "Thuong Hanh Buddhist Monastery", address: "2301 Woodlawn Rd, McKinney, TX 75071", street: "2301 Woodlawn Rd", city: "McKinney", state: "TX", postalCode: "75071" },
  { name: "Huong Sen Buddhist Temple", address: "19865 Seaton Ave, Perris, CA 92570", street: "19865 Seaton Ave", city: "Perris", state: "CA", postalCode: "92570" },
  { name: "Bulkwang Meditation Center", address: "104 Route 303, Tappan, NY 10963", street: "104 Route 303", city: "Tappan", state: "NY", postalCode: "10963" },
  { name: "Bub Hwa Sa", address: "7202 Poplar St #B202, Annandale, VA 22003", street: "7202 Poplar St #B202", city: "Annandale", state: "VA", postalCode: "22003" },
  { name: "Maryland Buddhist Vihara", address: "2600 Elmont St, Silver Spring, MD 20902", street: "2600 Elmont St", city: "Silver Spring", state: "MD", postalCode: "20902", website: "https://www.marylandbuddhistvihara.org" },
  { name: "Dharma College", address: "2222 Harold Way, Berkeley, CA 94704", street: "2222 Harold Way", city: "Berkeley", state: "CA", postalCode: "94704", website: "https://www.dharma-college.com" },
  { name: "Taego Order of Korean Buddhism (America-Europe Parish)", address: "1768 N. Glenview Ave, Anaheim Hills, CA 92807", street: "1768 N. Glenview Ave", city: "Anaheim Hills", state: "CA", postalCode: "92807", website: "https://taegoaeparish.org" },
  { name: "International Buddhist Committee of Washington DC", address: "3116 Memory Ln, Silver Spring, MD 20904", street: "3116 Memory Ln", city: "Silver Spring", state: "MD", postalCode: "20904" },
  { name: "Seattle Choeizan Enkyoji Nichiren Buddhist Temple", address: "501 S Jackson St #202, Seattle, WA 98104", street: "501 S Jackson St #202", city: "Seattle", state: "WA", postalCode: "98104" },
  { name: "Ambedkar Association of North America (AANA)", address: "7080 Forridge Dr, Canton, MI 48187", street: "7080 Forridge Dr", city: "Canton", state: "MI", postalCode: "48187", website: "https://aanausa.org" },
  { name: "Seattle Betsuin Buddhist Temple", address: "1427 S Main St, Seattle, WA 98144", street: "1427 S Main St", city: "Seattle", state: "WA", postalCode: "98144", website: "https://seattlebetsuin.org" },
  { name: "Borisa Zen Center", address: "4662 W Warm Springs Rd, Las Vegas, NV 89118", street: "4662 W Warm Springs Rd", city: "Las Vegas", state: "NV", postalCode: "89118" },
  { name: "Arrana Buddhist Monastery (Muryangsa)", address: "19730 Mouth of Monocacy Rd, Dickerson, MD 20842", street: "19730 Mouth of Monocacy Rd", city: "Dickerson", state: "MD", postalCode: "20842" },
  { name: "Tzu Chi USA", address: "Arcadia, CA", street: "", city: "Arcadia", state: "CA", postalCode: "", website: "https://www.tzuchi.us" },
  { name: "Gowoo Sunim (Bokyung Jeon) Temple", address: "New York", street: "", city: "New York", state: "", postalCode: "" },
  { name: "American Sri Lanka Buddhist Association", address: "115 John St, Staten Island, NY 10302", street: "115 John St", city: "Staten Island", state: "NY", postalCode: "10302" },
  { name: "Cambodian Buddhist Meditation Center (Watt Munisotaram)", address: "2925 220th St E, Empire, MN 55024", street: "2925 220th St E", city: "Empire", state: "MN", postalCode: "55024", website: "https://www.wattmunisotaram.org" },
  { name: "Wat Khmer Hawaii", address: "15-1435 20th Ave, Kea'au, HI 96749", street: "15-1435 20th Ave", city: "Kea'au", state: "HI", postalCode: "96749" },
  { name: "Wat Buddhasasanarangsey", address: "2533 N Valentine Ave, Fresno, CA 93722", street: "2533 N Valentine Ave", city: "Fresno", state: "CA", postalCode: "93722", website: "https://www.fresnocambodiantemple.org" },
  { name: "Wat Ahram Meanchey", address: "255 Grassland Ct, Bowling Green, KY 42101", street: "255 Grassland Ct", city: "Bowling Green", state: "KY", postalCode: "42101" },
];

const submittedIndividuals: readonly Individual[] = [
  { name: "Rajinder Kumar", location: "Clovis, CA" },
  { name: "Young Ho Jin Wol Lee", location: "Livermore, CA" },
];

const memberSource = JSON.parse(
  readFileSync(resolve(process.cwd(), "shared/ibaaMembers.json"), "utf8"),
) as MemberSource;

const publishedRows = memberSource.organizations.map((organization, index) => ({
  id: index + 1,
  name: organization.name,
  addressLine1: organization.street,
  addressLine2: null,
  city: organization.city,
  stateRegion: organization.state,
  postalCode: organization.postalCode,
  websiteUrl: organization.website ?? null,
  tradition: "",
  description: "",
  verificationStatus: "verified" as const,
}));

const queryState = vi.hoisted(() => ({
  data: [] as Array<Record<string, unknown>>,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    temples: {
      listPublished: {
        useQuery: () => ({
          data: queryState.data,
          isError: false,
          isLoading: false,
          isPending: false,
          error: null,
          refetch: vi.fn(),
        }),
      },
    },
  },
}));

async function renderMemberRoster() {
  const { MemberRoster } = await import("../client/src/components/site/MemberRoster");
  return render(<MemberRoster showFilters={true} />);
}

function requiredDirectoryGrid(container: HTMLElement) {
  const grid = container.querySelector<HTMLElement>(".directory-grid");
  expect(grid).not.toBeNull();
  if (!grid) throw new Error("MemberRoster must render organization cards in .directory-grid.");
  return grid;
}

beforeEach(() => {
  queryState.data = publishedRows;
});

afterEach(() => {
  cleanup();
  queryState.data = [];
});

describe("October 26 IBAA member roster", () => {
  it("matches the supplied source exactly, with 27 organizations, 2 individuals, and no invented fields", () => {
    expect(memberSource).toEqual({
      suppliedOn: "2026-10-26",
      organizations: submittedOrganizations,
      individuals: submittedIndividuals,
    });
    expect(memberSource.organizations).toHaveLength(27);
    expect(memberSource.individuals).toHaveLength(2);

    const suppliedWebsites = submittedOrganizations.flatMap(organization => organization.website ? [organization.website] : []);
    const omittedWebsites = submittedOrganizations.filter(organization => !organization.website);
    expect(suppliedWebsites).toHaveLength(12);
    expect(omittedWebsites).toHaveLength(15);
    expect(memberSource.organizations.filter(organization => organization.website)).toHaveLength(12);
    expect(memberSource.organizations.filter(organization => !organization.website)).toHaveLength(15);
  });

  it("maps the checked-in roster to verified data-API rows without inferring traditions, descriptions, websites, or address lines", () => {
    expect(publishedRows).toEqual(submittedOrganizations.map((organization, index) => ({
      id: index + 1,
      name: organization.name,
      addressLine1: organization.street,
      addressLine2: null,
      city: organization.city,
      stateRegion: organization.state,
      postalCode: organization.postalCode,
      websiteUrl: organization.website ?? null,
      tradition: "",
      description: "",
      verificationStatus: "verified",
    })));
  });

  it("renders every supplied organization name and exact supplied address in its organization card", async () => {
    const { container } = await renderMemberRoster();
    const grid = requiredDirectoryGrid(container);
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("article"));

    expect(cards).toHaveLength(27);
    for (const organization of submittedOrganizations) {
      const name = screen.getByText(organization.name, { exact: true });
      const card = name.closest<HTMLElement>("article");
      expect(card).not.toBeNull();
      if (!card) throw new Error(`Missing organization card for ${organization.name}.`);
      expect(grid.contains(card)).toBe(true);
      expect(within(card).getByText(organization.address, { exact: true })).toBeTruthy();
    }
  });

  it("renders exactly the 12 supplied website links and no link for any of the 15 website omissions", async () => {
    const { container } = await renderMemberRoster();
    const grid = requiredDirectoryGrid(container);
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("article"));
    const suppliedWebsites = submittedOrganizations.flatMap(organization => organization.website ? [organization.website] : []);

    const renderedWebsiteHrefs = Array.from(grid.querySelectorAll<HTMLAnchorElement>("a")).map(link => link.getAttribute("href"));
    expect(renderedWebsiteHrefs).toHaveLength(12);
    expect(renderedWebsiteHrefs.slice().sort()).toEqual(suppliedWebsites.slice().sort());

    for (const organization of submittedOrganizations) {
      const card = cards.find(candidate => candidate.textContent?.includes(organization.name));
      expect(card).toBeTruthy();
      if (!card) throw new Error(`Missing organization card for ${organization.name}.`);

      const links = Array.from(card.querySelectorAll<HTMLAnchorElement>("a"));
      if (organization.website) {
        expect(links).toHaveLength(1);
        expect(links[0].getAttribute("href")).toBe(organization.website);
      } else {
        expect(links).toHaveLength(0);
      }
    }
  });

  it("keeps the two individual members in their labeled section and excludes all provisional hosts from the 27 organization cards", async () => {
    const { container } = await renderMemberRoster();
    const grid = requiredDirectoryGrid(container);
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("article"));
    const individualTitle = screen.getByRole("heading", { name: "Individual Members" });
    const individualSection = container.querySelector<HTMLElement>("[aria-labelledby='individual-members-title']");

    expect(individualTitle.id).toBe("individual-members-title");
    expect(individualSection).not.toBeNull();
    if (!individualSection) throw new Error("Missing the labeled Individual Members section.");
    expect(individualSection.contains(individualTitle)).toBe(true);

    for (const individual of submittedIndividuals) {
      const memberLine = within(individualSection).getByText(`${individual.name} (${individual.location})`, { exact: true });
      expect(grid.contains(memberLine)).toBe(false);
      expect(cards.some(card => card.textContent?.includes(individual.name))).toBe(false);
    }

    expect(cards).toHaveLength(submittedOrganizations.length);
    expect(cards.every(card => submittedOrganizations.some(organization => card.textContent?.includes(organization.name)))).toBe(true);
    for (const provisionalHost of ["Drikung Kagyu Temple", "Wat Lao Buddhavong", "Fo Guang Shan Hsi Lai Temple"]) {
      expect(grid.textContent).not.toContain(provisionalHost);
    }
  });
});
