# IBAA Accessible Design System

The visual direction interprets “elegant and perfect” as **refined, calm, highly legible, and carefully consistent** rather than ornamental or overstated. The design combines institutional restraint with spiritual warmth and uses only verified real photography from IBAA or properly attributed sources.

## Color and Typography

| Token | Value | Primary use |
| --- | --- | --- |
| Ivory | `#FBF8F1` | Main page background and spacious editorial sections. |
| White | `#FFFFFF` | Cards, navigation surfaces, and reading panels. |
| Ink | `#20241F` | Primary text. |
| Deep maroon | `#6B1F2A` | Primary actions, headings, and ceremonial emphasis. |
| Forest green | `#214C3A` | Secondary actions, tradition and community emphasis. |
| Soft gold | `#C49A36` | Borders, icons, dividers, and decorative emphasis; not used for small body text on white. |
| Light gray | `#E9E7E1` | Rules, muted surfaces, and subtle section separation. |
| Muted text | `#62675F` | Metadata and secondary copy at accessible sizes. |

Headings use **Newsreader**, a dignified readable serif, with Georgia as the fallback. Body and interface text use **Source Sans 3**, with the system sans-serif stack as fallback. Body copy begins at 18 pixels with approximately 1.65 line height on editorial pages. Line length is constrained to roughly 65–75 characters.

## Layout Language

The public site uses a slim gold rule, a restrained utility bar, and a white primary header with the real IBAA identity. Homepage sections alternate between editorial split layouts, full-bleed real photography, and quiet ivory reading fields. Maroon and forest color blocks are used sparingly to anchor calls to action. Components use subtle one-pixel borders, small shadows, and modest corner radii rather than a generic grid of floating rounded cards.

Photography is cropped deliberately and always includes meaningful alternative text or an empty `alt` attribute when decorative. Captions and credits remain adjacent to the image. Leadership portraits use consistent aspect ratios without masking or stylized AI effects.

## Interaction and Accessibility

| Requirement | Implementation rule |
| --- | --- |
| Keyboard access | Every control is reachable in logical order; desktop dropdowns support click and keyboard behavior; the mobile menu traps focus only while open. |
| Focus visibility | A high-contrast maroon or forest focus ring remains visible on every interactive control. |
| Landmarks | Pages include skip link, semantic header, navigation, main, article or section landmarks, and footer. |
| Motion | Transitions remain under 250 milliseconds, affect only opacity or transform, and are disabled when reduced motion is requested. |
| Touch targets | Interactive targets are at least 44 by 44 CSS pixels where layout permits. |
| Forms | Labels are persistent, instructions precede fields, errors are associated with inputs, and status changes use polite live regions. |
| Video | Embeds are responsive, titled, privacy-enhanced, and never autoplay. A descriptive text link remains available. |
| Documents | Cards display title, file type, and an explicit view or download action. |
| Contrast | Gold is decorative; functional text and controls use maroon, forest, ink, or white combinations selected for WCAG contrast. |

The public experience will be validated at mobile, tablet, and desktop widths. The design will not claim perfection or total compliance without testing; implementation will target WCAG 2.2 AA patterns and document any remaining editorial obligations, especially alternative text and caption quality.
