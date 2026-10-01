import { formatArea } from '@/shared/lib/format'
import type { Project, ProjectType, ProjectUnitType } from '@/features/projects/types/projectTypes'

/**
 * Builds the unit configurations shown on a project's "Available Unit Types"
 * section.
 *
 * The catalogue stores what a development *is* — starting price, unit count,
 * category — and derives its configurations from that. Keeping the derivation
 * here rather than hand-writing three unit types for each of eleven projects
 * means a new development gets a complete, internally consistent set for free,
 * and the price ladder can never drift out of step with `startingPrice`.
 *
 * Once `GET /api/projects/:slug` returns real `unit_types` rows these become
 * the fallback for projects whose API payload omits the array — the
 * `ProjectUnitType` shape does not change.
 */

/** Multipliers against `project.startingPrice`, cheapest first. */
const PRICE_STEPS = [1, 1.45, 2.15] as const

interface UnitTemplate {
  name: string
  bedrooms: number | null
  bathrooms: number | null
  size: number
  summary: string
}

/**
 * Category-specific configurations.
 *
 * Residential and luxury schemes lead with apartments and terraces; commercial
 * and mixed-use schemes lead with office and retail units instead, because a
 * two-bedroom apartment would be wrong for them.
 */
const UNIT_TEMPLATES: Record<ProjectType, [UnitTemplate, UnitTemplate, UnitTemplate]> = {
  residential: [
    {
      name: '2 Bedroom Apartment',
      bedrooms: 2,
      bathrooms: 2,
      size: 120,
      summary: 'Two bedrooms, a separate living area and a covered parking bay.',
    },
    {
      name: '3 Bedroom Apartment',
      bedrooms: 3,
      bathrooms: 3,
      size: 180,
      summary: 'Three bedrooms with a guest room, dining space and covered parking.',
    },
    {
      name: '4 Bedroom Terrace',
      bedrooms: 4,
      bathrooms: 4,
      size: 240,
      summary: 'Four bedrooms across two floors, with a private entrance and rear yard.',
    },
  ],
  'luxury-apartments': [
    {
      name: '2 Bedroom Apartment',
      bedrooms: 2,
      bathrooms: 3,
      size: 165,
      summary: 'Two bedrooms with fitted kitchen, walk-in storage and two parking bays.',
    },
    {
      name: '3 Bedroom Apartment',
      bedrooms: 3,
      bathrooms: 3,
      size: 235,
      summary: 'Three bedrooms, separate service quarters access and full-height glazing.',
    },
    {
      name: 'Penthouse',
      bedrooms: 4,
      bathrooms: 4,
      size: 340,
      summary: 'Four bedrooms over a full floor, with a private terrace and skyline outlook.',
    },
  ],
  estate: [
    {
      name: '3 Bedroom Bungalow',
      bedrooms: 3,
      bathrooms: 3,
      size: 165,
      summary: 'A single-storey home with a fitted kitchen, rear yard and car port.',
    },
    {
      name: '4 Bedroom Terrace',
      bedrooms: 4,
      bathrooms: 4,
      size: 240,
      summary: 'Four bedrooms over two floors, with a private entrance and rear yard.',
    },
    {
      name: '5 Bedroom Detached',
      bedrooms: 5,
      bathrooms: 5,
      size: 320,
      summary: 'A detached family home with staff quarters and double garage parking.',
    },
  ],
  commercial: [
    {
      name: 'Office Suite',
      bedrooms: null,
      bathrooms: 2,
      size: 150,
      summary: 'An open floor plate with a reception, boardroom and two service lifts.',
    },
    {
      name: 'Corner Office Floor',
      bedrooms: null,
      bathrooms: 3,
      size: 260,
      summary: 'A near-column-free floor with dual aspect, boardroom and fitted reception.',
    },
    {
      name: 'Retail Unit',
      bedrooms: null,
      bathrooms: 1,
      size: 95,
      summary: 'A street-facing retail unit with display frontage and a service entrance.',
    },
  ],
  'mixed-use': [
    {
      name: '1 Bedroom Residence',
      bedrooms: 1,
      bathrooms: 1,
      size: 75,
      summary: 'A compact one-bedroom residence above the retail podium.',
    },
    {
      name: '2 Bedroom Residence',
      bedrooms: 2,
      bathrooms: 2,
      size: 115,
      summary: 'Two bedrooms with a separate living area and allocated parking.',
    },
    {
      name: 'Retail Unit',
      bedrooms: null,
      bathrooms: 1,
      size: 110,
      summary: 'A ground-floor retail or studio unit facing the main frontage.',
    },
  ],
}

/**
 * Rounds to a sensible quoted price.
 *
 * Naira unit prices are marketed as round figures, so a derived price is snapped
 * down to the nearest half-million rather than showing a stray `₦83,425,000`.
 */
function toQuotedPrice(value: number): number {
  return Math.max(15_000_000, Math.floor(value / 500_000) * 500_000)
}

/**
 * A configuration is treated as allocated once the development has sold through
 * a high share of its units, so the "Request Details" call to action can be
 * shown as unavailable without hardcoding per-project sales figures.
 */
function isConfigurationAvailable(project: UnitTypeSource, index: number): boolean {
  if (project.status === 'completed' && project.availableUnits === 0) return false

  const soldShare = 1 - project.availableUnits / project.totalUnits

  if (soldShare > 0.7) return index > 0

  return true
}

/** The unit configurations for a project, cheapest first. */
export function buildProjectUnitTypes(project: UnitTypeSource): ProjectUnitType[] {
  const templates = UNIT_TEMPLATES[project.projectType]

  return templates.map((template, index) => ({
    id: `${project.slug}-${index + 1}`,
    name: template.name,
    bedrooms: template.bedrooms,
    bathrooms: template.bathrooms,
    size: template.size,
    startingPrice: toQuotedPrice(project.startingPrice * PRICE_STEPS[index]),
    summary: template.summary,
    isAvailable: isConfigurationAvailable(project, index),
  }))
}

/**
 * The fields these builders read.
 *
 * Narrower than `Project` on purpose: `../data/projects` decorates a
 * `ProjectSeed` into a `Project` by calling these, and at that moment the record
 * is still incomplete. Typing the input as `Project` would force the factory to
 * lie about what it has.
 */
type UnitTypeSource = Pick<
  Project,
  'slug' | 'projectType' | 'startingPrice' | 'status' | 'availableUnits' | 'totalUnits'
>

/** "120 sqm" — matches the wording used by the properties feature. */
export function formatUnitSize(squareMetres: number): string {
  return formatArea(squareMetres)
}
