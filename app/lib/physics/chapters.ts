import type { ChapterSummary } from "./types";

/**
 * All thirteen chapters in textbook order.
 *
 * This registry is the single source of truth for the sidebar and the index
 * page; individual chapter bodies live in `chapters/chapter-N.ts` and are
 * imported lazily by the chapter route.
 */
export const CHAPTERS: ChapterSummary[] = [
  {
    slug: "units-and-dimensions",
    number: 1,
    title: "Units and Dimensions",
    shortTitle: "Units & Dimensions",
    minutes: 35,
    status: "complete",
    objectives: [
      "Understand physical quantities, fundamental and derived.",
      "Describe different systems of units.",
      "Define dimensions and formulate dimensional formulae.",
      "Write dimensional equations and apply these to verify various formulations.",
    ],
  },
  {
    slug: "force-and-motion",
    number: 2,
    title: "Force and Motion",
    shortTitle: "Force & Motion",
    minutes: 45,
    status: "planned",
    objectives: [
      "Understand scalar and vector quantities, addition of vectors, scalar and vector products.",
      "State and apply Newton's laws of motion.",
      "Describe linear momentum, circular motion and the application of centripetal force.",
    ],
  },
  {
    slug: "work-power-and-energy",
    number: 3,
    title: "Work, Power and Energy",
    shortTitle: "Work, Power & Energy",
    minutes: 40,
    status: "planned",
    objectives: [
      "Understand work, energy and power, their units and dimensions.",
      "Describe different types of energies and energy conservation.",
      "Solve relevant numerical problems.",
    ],
  },
  {
    slug: "rotational-motion",
    number: 4,
    title: "Rotational Motion",
    shortTitle: "Rotational Motion",
    minutes: 40,
    status: "planned",
    objectives: [
      "Define rotational motion and parameters such as torque, angular momentum and momentum conservation.",
      "Describe moment of inertia and radius of gyration.",
      "Solve relevant numerical problems.",
    ],
  },
  {
    slug: "properties-of-matter",
    number: 5,
    title: "Properties of Matter",
    shortTitle: "Properties of Matter",
    minutes: 45,
    status: "planned",
    objectives: [
      "Understand elasticity, deforming force and restoring force.",
      "Define stress, strain, Hooke's law, modulus of elasticity and pressure.",
      "Describe surface tension, viscosity and the effect of temperature on these.",
      "Understand fluid motion and the nature of flow.",
    ],
  },
  {
    slug: "heat-and-temperature",
    number: 6,
    title: "Heat and Temperature",
    shortTitle: "Heat & Temperature",
    minutes: 40,
    status: "planned",
    objectives: [
      "Define heat and temperature, and understand the difference between them.",
      "Describe principles of measuring temperature and different temperature scales.",
      "Enlist properties of heat radiations and the various modes of transfer of heat.",
    ],
  },
  {
    slug: "wave-motion-and-its-applications",
    number: 7,
    title: "Wave Motion and Its Applications",
    shortTitle: "Wave Motion",
    minutes: 50,
    status: "planned",
    objectives: [
      "Understand waves and wave motion, define the parameters of a wave and their relationship, and define simple harmonic motion.",
      "Describe acoustics, its associated parameters and methods to control the acoustics of buildings.",
      "Identify ultrasonic waves and enlist their engineering applications.",
    ],
  },
  {
    slug: "optics",
    number: 8,
    title: "Optics",
    shortTitle: "Optics",
    minutes: 50,
    status: "planned",
    objectives: [
      "Understand the properties of light, reflection and refraction, lens parameters, the lens formula and the power of a lens.",
      "Explain total internal reflection, the conditions for TIR and its applications.",
      "Describe the microscope, the telescope and their uses.",
    ],
  },
  {
    slug: "electrostatics",
    number: 9,
    title: "Electrostatics",
    shortTitle: "Electrostatics",
    minutes: 45,
    status: "planned",
    objectives: [
      "Understand the fundamentals of charges at rest and the properties of point charges.",
      "Explain conservation and quantization of charges.",
      "Relate the properties that lead to the charge storage capacity of electronic devices.",
    ],
  },
  {
    slug: "current-and-electricity",
    number: 10,
    title: "Current and Electricity",
    shortTitle: "Current & Electricity",
    minutes: 50,
    status: "planned",
    objectives: [
      "Describe electric current and the types of current, AC and DC.",
      "Define resistance and combinations of resistances, series and parallel.",
      "State Ohm's law, Kirchhoff's law and their applications.",
    ],
  },
  {
    slug: "electromagnetism",
    number: 11,
    title: "Electromagnetism",
    shortTitle: "Electromagnetism",
    minutes: 40,
    status: "planned",
    objectives: [
      "Understand the magnetic field associated with the flow of current and related parameters.",
      "Classify materials on the basis of magnetic properties.",
      "Describe magnetic flux and magnetic lines of force.",
    ],
  },
  {
    slug: "semiconductor-physics",
    number: 12,
    title: "Semiconductor Physics",
    shortTitle: "Semiconductors",
    minutes: 45,
    status: "planned",
    objectives: [
      "Understand energy levels and energy bands in solids.",
      "Describe semiconductor materials, their types and doping.",
      "Explain semiconductor junctions, junction diodes and transistors.",
    ],
  },
  {
    slug: "modern-physics",
    number: 13,
    title: "Modern Physics",
    shortTitle: "Modern Physics",
    minutes: 35,
    status: "planned",
    objectives: [
      "Understand the concepts of laser, emission processes and lasing conditions.",
      "List laser beam characteristics and engineering applications.",
      "Describe optical fibre, its structure, working principle and applications.",
      "Acquire some knowledge of nanotechnology and its long term applications.",
    ],
  },
];

export function getChapterSummary(slug: string): ChapterSummary | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function getNeighbours(slug: string) {
  const index = CHAPTERS.findIndex((chapter) => chapter.slug === slug);
  return {
    previous: index > 0 ? CHAPTERS[index - 1] : null,
    next: index >= 0 && index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null,
  };
}
