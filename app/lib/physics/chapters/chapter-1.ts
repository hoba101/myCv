import type { Chapter } from "../types";

/**
 * `h` means height in Example 5 but Planck's constant in Exercise 3.1, and `E`
 * is energy in most formulas but elasticity in the sound-wave example, so both
 * are supplied per example rather than guessed globally.
 */
const ELASTICITY = { M: 1, L: -1, T: -2 };

const gasEquationSymbols = {
  P: { M: 1, L: -1, T: -2 },
  T: { T: 1 },
  R: { M: 1, L: 2, T: -3, Θ: -1 },
  v: { L: 3 },
};

export const chapter1: Chapter = {
  slug: "units-and-dimensions",
  number: 1,
  title: "Units and Dimensions",
  shortTitle: "Units & Dimensions",
  status: "complete",
  minutes: 35,
  objectives: [
    "Understand physical quantities, fundamental and derived.",
    "Describe different systems of units.",
    "Define dimensions and formulate dimensional formulae.",
    "Write dimensional equations and apply these to verify various formulations.",
  ],

  sections: [
    /* ================================================================ */
    {
      id: "summary",
      number: "0",
      title: "Visual Summary",
      summary: "The whole chapter on one screen.",
      blocks: [
        {
          kind: "summary",
          title: "Visual Summary",
          intro:
            "Everything in this chapter follows from one idea: a measurement is a number multiplied by a unit, and the unit hides a fixed combination of mass, length and time.",
          cards: [
            {
              title: "Measurement",
              points: [
                "Measuring means comparing an unknown with a known fixed quantity.",
                "That known fixed quantity is the unit.",
                "Physical quantity = numerical value × unit.",
              ],
              formula: "Q = n*u",
            },
            {
              title: "Fundamental vs Derived",
              points: [
                "Fundamental quantities are independent — mass, length, time.",
                "Derived quantities are built from them — area, speed, force.",
                "Area is length × breadth, so it is (length)².",
              ],
              formula: "l*b",
              chips: [
                { symbol: "L", label: "Mass" },
                { symbol: "T", label: "Length" },
              ],
            },
            {
              title: "Systems of Units",
              points: [
                "CGS — centimetre, gram, second.",
                "FPS — foot, pound, second.",
                "MKS — metre, kilogram, second.",
                "SI — MKS extended with four more fundamental and two supplementary units.",
              ],
            },
            {
              title: "Dimensions",
              points: [
                "The powers to which M, L and T are raised.",
                "Dimensions show the nature of a quantity, not its magnitude.",
                "Strain and angle are dimensionless.",
              ],
              formula: "m/V",
            },
            {
              title: "Homogeneity",
              points: [
                "Every term on both sides of an equation must share dimensions.",
                "Only like quantities can be added or subtracted.",
                "If the powers match, the equation is dimensionally correct.",
              ],
              formula: "s = u*t + 1/2*a*t2",
            },
            {
              title: "Three Uses",
              points: [
                "Check whether a physical equation is correct.",
                "Convert between CGS, MKS, FPS and SI.",
                "Derive relations among physical quantities.",
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "physics-and-physical-quantities",
      number: "1.1",
      title: "Definition of Physics and Physical Quantities",
      summary: "What physics studies, and what counts as a measurable quantity.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "physics",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Physics",
                body: "Physics is the branch of science which deals with the study of nature and the properties of matter and energy. Its subject matter includes heat, light, sound, electricity, magnetism and the structure of atoms.",
              },
            },
            {
              id: "method",
              kind: "text",
              body: "To design a law of physics a scientific method is followed, which includes verification by experiment. Physics attempts to measure quantities with the best accuracy, and so it can also be defined as the science of measurement.",
            },
            {
              id: "applied",
              kind: "callout",
              callout: {
                kind: "note",
                title: "Applied Physics",
                body: "Applied Physics is the application of physics to solve human problems. It is usually considered as a bridge or connection between Physics and Engineering.",
              },
            },
            {
              id: "quantities",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Physical Quantities",
                body: "All quantities in terms of which the laws of physics can be expressed, and which can be measured, are called physical quantities.",
              },
            },
            {
              id: "quantity-examples",
              kind: "list",
              items: ["Distance", "Speed", "Mass", "Force", "Time", "Volume"],
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "units-fundamental-and-derived",
      number: "1.2",
      title: "Units: Fundamental and Derived Units",
      summary: "Measurement, unit, and the split between fundamental and derived.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "measurement",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Measurement",
                body: "In daily life we need to express and compare the magnitude of different quantities, which can only be done by measuring them. Measurement is the comparison of an unknown physical quantity with a known fixed physical quantity.",
              },
            },
            {
              id: "unit",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Unit",
                body: "The known fixed physical quantity used as a standard for measurement is called a unit.",
              },
            },
            {
              id: "length-example",
              kind: "text",
              body: "When we say the length of a classroom is 8 metre, we compare the length of the classroom with the standard quantity of length called the metre. So the physical quantity equals the numerical value multiplied by the unit.",
            },
            {
              id: "nu",
              kind: "callout",
              callout: {
                kind: "key",
                title: "The measurement equation",
                body: "For any measurement, Q is the physical quantity, n is the numerical value and u is the standard unit.",
                formula: "Q = n*u",
              },
            },
            {
              id: "stool-example",
              kind: "text",
              body: "For the mass of a stool we write 15 kg. Here mass is the physical quantity, 15 is the numerical value and kg is the standard unit — the stool's mass is 15 times the known quantity the kilogram.",
            },
            {
              id: "standard-unit",
              kind: "list",
              items: [
                "It should be well defined — its concept should be clear.",
                "It should not change with physical conditions like temperature, pressure or stress.",
                "It should be suitable in size; neither too large nor too small.",
                "It should not change with place or time.",
                "It should be reproducible.",
                "It should be internationally accepted.",
              ],
            },
            {
              id: "fundamental",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Fundamental Quantity",
                body: "A fundamental quantity is independent of other physical quantities. In mechanics, mass, length and time are fundamental quantities, and their units are called fundamental units.",
              },
            },
            {
              id: "derived",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Derived Quantity",
                body: "A derived quantity is obtained from fundamental quantities. Area is a derived quantity, because area = length × breadth = length × length = (length)². The units for derived quantities are called derived units.",
              },
            },
            {
              id: "classification-table",
              kind: "table",
              table: {
                caption: "Classification of units",
                columns: ["Physical quantity", "Kind", "Example units"],
                rows: [
                  ["Mass", "Fundamental", "kg, gram, pound"],
                  ["Length", "Fundamental", "metre, centimetre, foot"],
                  ["Time", "Fundamental", "second"],
                  ["Area", "Derived", "metre²"],
                  ["Volume", "Derived", "metre³"],
                  ["Speed", "Derived", "m/s"],
                  ["Force", "Derived", "newton"],
                ],
              },
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "systems-of-units",
      number: "1.3",
      title: "Systems of Units: CGS, FPS, MKS, SI",
      summary: "The four systems, the seven SI base units and the supplementary units.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "four-systems",
              kind: "text",
              body: "For the measurement of physical quantities the following systems are commonly used.",
            },
            {
              id: "cgs",
              kind: "callout",
              callout: {
                kind: "note",
                title: "C.G.S system",
                body: "The unit of length is the centimetre, the unit of mass is the gram and the unit of time is the second.",
              },
            },
            {
              id: "fps",
              kind: "callout",
              callout: {
                kind: "note",
                title: "F.P.S system",
                body: "The unit of length is the foot, the unit of mass is the pound and the unit of time is the second.",
              },
            },
            {
              id: "mks",
              kind: "callout",
              callout: {
                kind: "note",
                title: "M.K.S system",
                body: "The unit of length is the metre, the unit of mass is the kilogram and the unit of time is the second.",
              },
            },
            {
              id: "si",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "S.I system",
                body: "The SI system is an improved and extended version of the M.K.S system, and is called the International System of Units.",
              },
            },
            {
              id: "why-si",
              kind: "text",
              body: "With the development of science and technology, mass, length and time were not sufficient, because many other quantities such as electric current and heat were introduced. More fundamental units were therefore required. MKS was modified by adding four other fundamental quantities and two supplementary quantities.",
            },
            {
              id: "si-fundamentals-table",
              kind: "table",
              table: {
                caption: "Table of fundamental units",
                columns: ["Sr. No.", "Name of physical quantity", "Unit", "Symbol"],
                rows: [
                  ["1", "Length", "Metre", "m"],
                  ["2", "Mass", "Kilogram", "kg"],
                  ["3", "Time", "Second", "s"],
                  ["4", "Temperature", "Kelvin", "K"],
                  ["5", "Electric current", "Ampere", "A"],
                  ["6", "Luminous intensity", "Candela", "cd"],
                  ["7", "Quantity of matter", "Mole", "mol"],
                ],
              },
            },
            {
              id: "si-supplementary-table",
              kind: "table",
              table: {
                caption: "Table of supplementary units",
                columns: ["Sr. No.", "Name of physical quantity", "Unit", "Symbol"],
                rows: [
                  ["1", "Plane angle", "Radian", "rad"],
                  ["2", "Solid angle", "Steradian", "sr"],
                ],
              },
            },
            {
              id: "si-advantages",
              kind: "list",
              items: [
                "It is a coherent system — derived units are obtained simply by multiplying or dividing fundamental units.",
                "It is a rational system — it uses only one unit for one physical quantity, for example Joule for all forms of energy (heat, light, mechanical).",
                "It is a metric system — multiples and submultiples are expressed in powers of ten.",
              ],
            },
            {
              id: "base-unit-definitions",
              kind: "text",
              body: "The seven base units are defined as follows.",
            },
            {
              id: "base-definitions",
              kind: "list",
              items: [
                "Metre (m): the length of the path travelled by light in vacuum during a time interval of 1/299 792 458 of a second.",
                "Kilogram (kg): the mass of the platinum-iridium prototype approved by the Conférence Générale des Poids et Mesures in Paris in 1889, kept by the Bureau International des Poids et Mesures.",
                "Second (s): the duration of 9 192 631 770 periods of the radiation corresponding to the transition between two hyperfine levels of the ground state of the Cesium-133 atom.",
                "Ampere (A): the intensity of a constant current which, if maintained in two straight parallel conductors of infinite length and negligible circular cross-section placed 1 metre apart in vacuum, would produce a force equal to 2 × 10⁻⁷ newton per metre of length.",
                "Kelvin (K): the fraction 1/273.16 of the thermodynamic temperature of the triple point of water.",
                "Candela (cd): the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 × 10¹² hertz and has a radiant intensity in that direction of 1/683 watt per steradian.",
                "Mole (mol): the amount of substance of a system containing as many elementary entities as there are atoms in 0.012 kilogram of Carbon-12.",
              ],
            },
            {
              id: "supplementary-definitions",
              kind: "text",
              body: "The supplementary units are defined geometrically.",
            },
            {
              id: "radian",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Radian (rad)",
                body: "The supplementary unit of plane angle. It is the plane angle subtended at the centre of a circle by an arc of the circle equal to the radius of the circle. It is denoted by θ, where θ = l / r, l being the length of the arc and r the radius.",
                formula: "l/r",
              },
            },
            {
              id: "steradian",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Steradian (sr)",
                body: "The supplementary unit of solid angle. It is the angle subtended at the centre of a sphere by a surface area of the sphere equal to the square of the radius of the sphere. It is denoted by Ω, where Ω = Δs / r².",
                formula: "l2/l2",
              },
            },
            {
              id: "prefixes",
              kind: "table",
              table: {
                caption: "Some important SI prefixes",
                columns: ["Symbol", "Prefix", "Multiplier", "Symbol", "Prefix", "Multiplier"],
                rows: [
                  ["d", "deci", "10⁻¹", "da", "deca", "10¹"],
                  ["c", "centi", "10⁻²", "h", "hecto", "10²"],
                  ["m", "milli", "10⁻³", "k", "kilo", "10³"],
                  ["μ", "micro", "10⁻⁶", "M", "mega", "10⁶"],
                  ["n", "nano", "10⁻⁹", "G", "giga", "10⁹"],
                  ["p", "pico", "10⁻¹²", "T", "tera", "10¹²"],
                  ["f", "femto", "10⁻¹⁵", "P", "peta", "10¹⁵"],
                  ["a", "atto", "10⁻¹⁸", "E", "exa", "10¹⁸"],
                ],
              },
            },
            {
              id: "length-units",
              kind: "table",
              table: {
                caption: "Some important units of length",
                columns: ["Unit", "Symbol", "In metres"],
                rows: [
                  ["1 micron", "μm", "10⁻⁶ m = 10⁻⁴ cm"],
                  ["1 angstrom", "Å", "10⁻¹⁰ m = 10⁻⁸ cm"],
                  ["1 fermi", "fm", "10⁻¹⁵ m"],
                  ["1 light year", "ly", "9.46 × 10¹⁵ m"],
                  ["1 parsec", "pc", "3.26 light years"],
                ],
              },
            },
            {
              id: "mass-factors",
              kind: "table",
              table: {
                caption: "Some conversion factors of mass",
                columns: ["From", "To"],
                rows: [
                  ["1 kilogram", "2.2046 pound"],
                  ["1 pound", "453.6 gram"],
                  ["1 kilogram", "1000 gram"],
                  ["1 milligram", "10⁻³ gram"],
                  ["1 centigram", "10⁻² gram"],
                  ["1 decigram", "10⁻¹ gram"],
                  ["1 quintal", "100 kg"],
                  ["1 metric ton", "1000 kilogram"],
                ],
              },
            },
          ],
        },
        {
          kind: "scaleSlider",
          title: "SI Prefix Explorer",
          description:
            "Drag across thirty-seven orders of magnitude. The prefix list is exactly the one tabulated above, and the dimension of the quantity stays fixed while its magnitude changes by a factor of a thousand at a time.",
        },
      ],
    },

    /* ================================================================ */
    {
      id: "definition-of-dimensions",
      number: "1.4",
      title: "Definition of Dimensions",
      summary: "M, L and T exponents — the nature of a quantity, not its magnitude.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "dimensions",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Dimensions",
                body: "Dimensions are the powers to which the fundamental units of mass, length and time — written as M, L and T — are raised. They include the nature of a quantity and not its magnitude.",
              },
            },
            {
              id: "area-derivation",
              kind: "text",
              body: "Area = length × breadth = [L¹] × [L¹] = [L²] = [M⁰L²T⁰]. The powers (0, 2, 0) of the fundamental units are the dimensions of area in mass, length and time respectively.",
            },
            {
              id: "density-derivation",
              kind: "text",
              body: "Density = mass / volume = [M] / [L³] = [M¹L⁻³T⁰].",
            },
            {
              id: "dimensional-formula",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Dimensional Formula",
                body: "An expression along with the powers of mass, length and time which indicates how a physical quantity depends upon the fundamental physical quantities.",
              },
            },
            {
              id: "speed-formula",
              kind: "text",
              body: "Speed = distance / time = [L¹] / [T¹] = [M⁰L¹T⁻¹]. This tells us that speed depends upon L and T, and does not depend upon M.",
            },
            {
              id: "dimensional-equation",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Dimensional Equation",
                body: "An equation obtained by equating a physical quantity with its dimensional formula is called a dimensional equation.",
              },
            },
            {
              id: "equations",
              kind: "table",
              table: {
                caption: "Dimensional equations",
                columns: ["Physical quantity", "Dimensional equation"],
                rows: [
                  ["Area", "[M⁰L²T⁰]"],
                  ["Density", "[M¹L⁻³T⁰]"],
                  ["Velocity", "[M⁰L¹T⁻¹]"],
                ],
              },
            },
          ],
        },
        {
          kind: "explorer",
          title: "Dimension Explorer",
          description:
            "Move the powers of mass, length and time and watch the dimension, the implied SI unit and the matching physical quantity update live.",
        },
      ],
    },

    /* ================================================================ */
    {
      id: "dimensional-formulae",
      number: "1.5",
      title: "Dimensional Formulae and SI Units of Physical Quantities",
      summary: "The master reference table, and how physical quantities are classified.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "master-table",
              kind: "table",
              table: {
                caption: "Dimensional formula and SI unit of common physical quantities",
                columns: ["Sr.", "Physical quantity", "Formula", "Dimensions", "SI unit"],
                rows: [
                  ["1", "Force", "Mass × acceleration", "[M¹L¹T⁻²]", "Newton (N)"],
                  ["2", "Work", "Force × distance", "[M¹L²T⁻²]", "Joule (J)"],
                  ["3", "Power", "Work / time", "[M¹L²T⁻³]", "Watt (W)"],
                  ["4", "Energy (all forms)", "Stored work", "[M¹L²T⁻²]", "Joule (J)"],
                  ["5", "Pressure, Stress", "Force / area", "[M¹L⁻¹T⁻²]", "Nm⁻²"],
                  ["6", "Momentum", "Mass × velocity", "[M¹L¹T⁻¹]", "kgms⁻¹"],
                  ["7", "Moment of force", "Force × distance", "[M¹L²T⁻²]", "Nm"],
                  ["8", "Impulse", "Force × time", "[M¹L¹T⁻¹]", "Ns"],
                  ["9", "Strain", "Change in dimension / original dimension", "[M⁰L⁰T⁰]", "No unit"],
                  ["10", "Modulus of elasticity", "Stress / strain", "[M¹L⁻¹T⁻²]", "Nm⁻²"],
                  ["11", "Surface energy", "Energy / area", "[M¹L⁰T⁻²]", "Joule/m²"],
                  ["12", "Surface tension", "Force / length", "[M¹L⁰T⁻²]", "N/m"],
                  ["13", "Coefficient of viscosity", "Force × distance / (area × velocity)", "[M¹L⁻¹T⁻¹]", "N/m²"],
                  ["14", "Moment of inertia", "Mass × (radius of gyration)²", "[M¹L²T⁰]", "Kg-m²"],
                  ["15", "Angular velocity", "Angle / time", "[M⁰L⁰T⁻¹]", "Rad. per sec"],
                  ["16", "Frequency", "1 / time period", "[M⁰L⁰T⁻¹]", "Hertz"],
                  ["17", "Area", "Length × breadth", "[M⁰L²T⁰]", "Metre²"],
                  ["18", "Volume", "Length × breadth × height", "[M⁰L³T⁰]", "Metre³"],
                  ["19", "Density", "Mass / volume", "[M¹L⁻³T⁰]", "Kg/m³"],
                  ["20", "Speed or velocity", "Distance / time", "[M⁰L¹T⁻¹]", "m/s"],
                  ["21", "Acceleration", "Velocity / time", "[M⁰L¹T⁻²]", "m/s²"],
                  ["22", "Pressure", "Force / area", "[M¹L⁻¹T⁻²]", "N/m²"],
                ],
              },
            },
            {
              id: "classification",
              kind: "text",
              body: "Physical quantities are classified into four categories on the basis of dimensional analysis.",
            },
            {
              id: "dimensional-constant",
              kind: "callout",
              callout: {
                kind: "note",
                title: "1. Dimensional Constant",
                body: "Physical quantities which possess dimensions and have a constant (fixed) value. Examples: Planck's constant, gas constant, universal gravitational constant.",
              },
            },
            {
              id: "dimensional-variable",
              kind: "callout",
              callout: {
                kind: "note",
                title: "2. Dimensional Variable",
                body: "Physical quantities which possess dimensions but do not have a fixed value. Examples: velocity, acceleration, force.",
              },
            },
            {
              id: "dimensionless-constant",
              kind: "callout",
              callout: {
                kind: "note",
                title: "3. Dimensionless Constant",
                body: "Physical quantities which do not possess dimensions but have a constant (fixed) value. Examples: e, π, and the numbers 1, 2, 3, 4, 5.",
              },
            },
            {
              id: "dimensionless-variable",
              kind: "callout",
              callout: {
                kind: "note",
                title: "4. Dimensionless Variable",
                body: "Physical quantities which do not possess dimensions but have a variable value. Examples: angle, strain, specific gravity.",
              },
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "interactive-formulas",
      number: "1.6",
      title: "Interactive Formulas",
      summary: "Type any formula and watch its dimensions get derived live.",
      blocks: [
        {
          kind: "lab",
          lab: {
            title: "Dimensional Analysis Lab",
            description:
              "Every result below is computed, not hard-coded. Type an expression or a full equation and the engine will derive its dimensions using the principle of homogeneity. Superscript notation works — you can write mv2/r, v^2 or (1/2)*a*t^2.",
            presets: [
              {
                label: "Force: F = mv²/r",
                equation: "F = m*v2/r",
                display: "F = mv²/r",
                expect: "correct",
                note: "Coulomb's law. Both sides reduce to [M¹L¹T⁻²].",
              },
              {
                label: "Simple pendulum: t = 2π√(l/g)",
                equation: "t = 2*pi*sqrt(l/g)",
                display: "t = 2π√(l/g)",
                expect: "correct",
                note: "The half power from the square root is carried exactly, so [L¹T⁻²] raised to ½ gives [T¹].",
              },
              {
                label: "Speed of sound: v = √(E/d)",
                equation: "v = sqrt(E/d)",
                display: "v = √(E/d)",
                symbols: { E: ELASTICITY },
                expect: "correct",
                note: "Here E is elasticity (a modulus) and d is the density of the medium.",
              },
              {
                label: "Kinematics: s = ut + ½at²",
                equation: "s = u*t + 1/2*a*t2",
                display: "s = ut + ½at²",
                expect: "correct",
                note: "Every term is a length, so the terms may legitimately be added.",
              },
              {
                label: "Energy: E = mgh + ½mv²",
                equation: "E = m*g*h + 1/2*m*v2",
                display: "E = mgh + ½mv²",
                expect: "correct",
              },
              {
                label: "Wrong: v³ − u² = 2as²",
                equation: "v3-u2 = 2*a*s2",
                display: "v³ − u² = 2as²",
                expect: "incorrect",
                note: "v³ and u² have different dimensions, so they cannot be subtracted at all.",
              },
              {
                label: "Wrong: h = 2Td/rg cos θ",
                equation: "h = 2*T*d/(r*g*cos(theta))",
                display: "h = 2Td/(rg cos θ)",
                expect: "incorrect",
                note: "Cosine is dimensionless, but the powers of M, L and T do not balance.",
              },
              {
                label: "Gas law: find [a] and [b]",
                equation: "(P + a/v2)*(v - b) = R*T",
                display: "(P + a/v²)(v − b) = RT",
                symbols: gasEquationSymbols,
                solveFor: ["a", "b"],
                note: "Because P + a/v² is a sum of like quantities, a/v² must have the dimensions of P.",
              },
              {
                label: "de Broglie: find Planck's constant",
                equation: "lamda = h/(m*v)",
                display: "λ = h / mv",
                symbols: { lamda: { L: 1 } },
                solveFor: ["h"],
                note: "Rearranging to h = λmv gives [M¹L²T⁻¹] — Planck's constant.",
              },
            ],
          },
        },
        {
          kind: "converter",
          title: "Unit Converter",
          description:
            "Conversion between the CGS, FPS, MKS and SI systems. The converter refuses to convert between quantities with different dimensions, applying the same homogeneity principle used above.",
        },
      ],
    },

    /* ================================================================ */
    {
      id: "principle-of-homogeneity",
      number: "1.7",
      title: "Principle of Homogeneity of Dimensions",
      summary: "Why only like quantities can be added — and how it tests an equation.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "homogeneity",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Principle of Homogeneity of Dimensions",
                body: "The dimensions of all the terms on both sides of an equation must be the same. The comparison, addition and subtraction of all physical quantities is possible only if they are of the same nature, that is, if they have the same dimensions.",
              },
            },
            {
              id: "homogeneity-test",
              kind: "text",
              body: "If the powers of M, L and T on the two sides of an equation are the same, the physical equation is correct; otherwise it is not. This principle is therefore very helpful for checking the correctness of a physical equation.",
            },
            {
              id: "worked-ut-at2",
              kind: "text",
              body: "A physical relation must be dimensionally homogeneous — all terms on both sides must have the same dimensions. Consider the equation s = ut + ½at². Equating a length to a velocity and a time seems meaningless at first, but if the equation is dimensionally homogeneous it does have physical meaning.",
            },
            {
              id: "ut-at2-dims",
              kind: "table",
              table: {
                caption: "Dimensions of each quantity in s = ut + ½at²",
                columns: ["Quantity", "Symbol", "Dimensions"],
                rows: [
                  ["Distance", "s", "[L¹]"],
                  ["Velocity", "u", "[L¹T⁻¹]"],
                  ["Time", "t", "[T¹]"],
                  ["Acceleration", "a", "[L¹T⁻²]"],
                  ["Constant", "½", "no dimensions"],
                ],
              },
            },
            {
              id: "ut-at2-working",
              kind: "text",
              body: "The dimension of the left-hand side is [L¹]. For the right-hand side, ut + ½at² = [L¹T⁻¹][T¹] + [L¹T⁻²][T²] = [L¹] + [L¹]. All terms on both sides have the same dimensions, so the equation is dimensionally homogeneous.",
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "applications-and-limitations",
      number: "1.8",
      title: "Dimensional Equations: Applications and Limitations",
      summary: "The three uses of dimensional analysis, and what it cannot do.",
      blocks: [
        {
          kind: "topics",
          topics: [
            {
              id: "dimensional-analysis",
              kind: "callout",
              callout: {
                kind: "definition",
                title: "Dimensional Analysis",
                body: "A careful examination of the dimensions of the various quantities involved in a physical relation is called dimensional analysis. It is of great help in a number of ways.",
              },
            },
            {
              id: "three-uses",
              kind: "list",
              items: [
                "Checking the correctness of a physical equation.",
                "Converting a physical quantity from one system of units into another.",
                "Deriving a relation among various physical quantities.",
              ],
            },
            {
              id: "conversion-relation",
              kind: "text",
              body: "For converting between systems, write the quantity as Q = n₁u₁ = n₂u₂. If M₁L₁T₁ are the fundamental units of the first system and M₂L₂T₂ of the other, then u₁ = [M₁ᵃL₁ᵇT₁ᶜ] and u₂ = [M₂ᵃL₂ᵇT₂ᶜ], giving n₂ = n₁(M₁/M₂)ᵃ(L₁/L₂)ᵇ(T₁/T₂)ᶜ. Take the system in which the numerical value is given as the first system.",
            },
            {
              id: "limitations-heading",
              kind: "text",
              body: "The method of dimensions has the following limitations.",
            },
            {
              id: "limitations",
              kind: "list",
              items: [
                "It does not find the value of dimensionless constants; those must be determined by experiment or mathematical investigation.",
                "It fails to derive the formula of a quantity depending on more than three factors, because only three equations are obtained by comparing the powers of M, L and T.",
                "It fails to derive relations involving exponential and trigonometric functions.",
                "It cannot be applied directly to relations with more than one term on a side, such as v = u + at or s = ut + ½at², though such relations can be derived indirectly.",
                "A dimensionally correct relation may not be a true physical relation, because dimensional equality is not sufficient for correctness.",
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "solved-examples",
      number: "1.9",
      title: "Step-by-Step Solved Examples",
      summary: "Every worked example from the chapter, revealed one step at a time.",
      blocks: [
        {
          kind: "examples",
          heading: "Solved Examples",
          examples: [
            {
              id: "ex1",
              number: 1,
              title: "Derive the dimensional formula of four quantities",
              problem:
                "Derive the dimensional formula of: (i) Density (ii) Power (iii) Coefficient of viscosity (iv) Angle.",
              conclusion:
                "Only angle turns out to be dimensionless — its formula is [M⁰L⁰T⁰], so it has no unit of its own.",
              steps: [
                {
                  title: "(i) Density = mass / volume",
                  detail: "Mass is [M] and volume is [L³], so dividing subtracts the powers of length.",
                  formula: "m/V",
                },
                {
                  title: "(ii) Power = work / time",
                  detail: "Work is force × distance, and force is mass × acceleration.",
                  formula: "W/t",
                },
                {
                  title: "(iii) Coefficient of viscosity",
                  detail:
                    "Viscosity = force × distance / (area × velocity). Multiplying the numerator: [M] × [LT⁻²] × [L] × [T].",
                  formula: "F*d/(A*v)",
                },
                {
                  title: "(iv) Angle = arc length / radius",
                  detail:
                    "Both the arc and the radius are lengths, so the powers of L cancel completely and no dimensions remain.",
                  formula: "l/r",
                },
              ],
              verify: {
                label: "Viscosity",
                equation: "eta = F*d/(A*v)",
                display: "η = F·d / (A·v)",
                symbols: { eta: { M: 1, L: -1, T: -1 }, d: { L: 1 } },
                expect: "correct",
              },
            },
            {
              id: "ex2",
              number: 2,
              title: "Which pairs have the same dimensions?",
              problem:
                "Explain which of the following pairs of physical quantities have the same dimension: (i) Work and Power (ii) Stress and Pressure (iii) Momentum and Impulse.",
              conclusion:
                "Stress and pressure share [M¹L⁻¹T⁻²], and momentum and impulse share [M¹L¹T⁻¹]. Work and power do not — power carries one extra power of time.",
              steps: [
                {
                  title: "(i) Work vs Power",
                  detail: "Work = force × distance = [M¹L¹T⁻²] × [L] = [M¹L²T⁻²].",
                  formula: "F*l",
                },
                {
                  title: "Power = work / time",
                  detail: "Dividing by time removes a power of T: [M¹L²T⁻³]. The powers of T differ, so they are not the same.",
                  formula: "W/t",
                },
                {
                  title: "(ii) Stress and Pressure",
                  detail: "Stress = force / area = [M¹L¹T⁻²] / [L²] = [M¹L⁻¹T⁻²].",
                  formula: "F/l2",
                },
                {
                  title: "Pressure = force / area",
                  detail: "Identical derivation, so pressure = [M¹L⁻¹T⁻²] as well. They are the same.",
                  formula: "F/l2",
                },
                {
                  title: "(iii) Momentum vs Impulse",
                  detail: "Momentum = mass × velocity = [M][L¹T⁻¹] = [M¹L¹T⁻¹].",
                  formula: "m*v",
                },
                {
                  title: "Impulse = force × time",
                  detail: "[M¹L¹T⁻²] × [T] = [M¹L¹T⁻¹]. The same as momentum.",
                  formula: "F*t",
                },
              ],
            },
            {
              id: "ex3",
              number: 3,
              title: "Check the correctness of two formulae",
              problem:
                "Check the correctness of the following formulae by dimensional analysis: (i) F = mv²/r (ii) t = 2π√(l/g), where all letters have their usual meanings.",
              conclusion:
                "Both relations are dimensionally correct — each reduces to [M¹L¹T⁻²] and [T¹] respectively.",
              steps: [
                {
                  title: "(i) Left-hand side",
                  detail: "Force is [M¹L¹T⁻²].",
                },
                {
                  title: "(i) Right-hand side",
                  detail: "Substitute [M] × [L¹T⁻¹]² / [L], giving [M¹L²T⁻²] / [L] = [M¹L¹T⁻²].",
                  formula: "m*v2/r",
                },
                {
                  title: "(ii) Left-hand side",
                  detail: "Time is [T¹] = [M⁰L⁰T¹].",
                },
                {
                  title: "(ii) Right-hand side",
                  detail:
                    "Length is [L¹] and g is [L¹T⁻²]. Since 2π is a constant with no dimensions, √(l/g) = ([L¹]/[L¹T⁻²])^½ = [T¹].",
                  formula: "2*pi*sqrt(l/g)",
                },
              ],
              verify: {
                label: "F = mv²/r",
                equation: "F = m*v2/r",
                display: "F = mv²/r",
                expect: "correct",
              },
            },
            {
              id: "ex4",
              number: 4,
              title: "Check the equation for the velocity of sound",
              problem:
                "By dimensional analysis check the correctness of v = √(E/d), where V is the velocity of sound, E is the elasticity and d is the density of the medium.",
              conclusion:
                "Both sides give [M⁰L¹T⁻¹], so the equation is correct.",
              steps: [
                {
                  title: "Left-hand side",
                  detail: "Velocity is [M⁰L¹T⁻¹].",
                },
                {
                  title: "Known dimensions",
                  detail: "Elasticity E = [M¹L⁻¹T⁻²] and density d = [M¹L⁻³T⁰].",
                },
                {
                  title: "Right-hand side",
                  detail:
                    "√(E/d) = [M¹L⁻¹T⁻² / M¹L⁻³T⁰]^½ = [L²T⁻²]^½ = [M⁰L¹T⁻¹].",
                  formula: "sqrt(E/d)",
                },
              ],
              verify: {
                label: "v = √(E/d)",
                equation: "v = sqrt(E/d)",
                display: "v = √(E/d)",
                symbols: { E: ELASTICITY },
                expect: "correct",
              },
            },
            {
              id: "ex5",
              number: 5,
              title: "A relation that fails the test",
              problem:
                "Using the principle of homogeneity of dimensions, check the correctness of the equation h = 2Td / rg cos θ.",
              conclusion:
                "The left side is a height [M⁰L¹T⁰] while the right side is [M²L⁻⁵T⁰], so the formula is not correct.",
              steps: [
                {
                  title: "Left-hand side",
                  detail: "Height h = [M⁰L¹T⁰].",
                },
                {
                  title: "Dimensions of the symbols",
                  detail:
                    "T (surface tension) = [M¹L⁰T⁻²], D (density) = [M¹L⁻³T⁰], r (radius) = [M⁰L¹T⁰], g (acceleration due to gravity) = [M⁰L¹T⁻²].",
                },
                {
                  title: "Cosine has no dimensions",
                  detail: "cos θ = [M⁰L⁰T⁰], so it contributes nothing to the sum of powers.",
                },
                {
                  title: "Right-hand side",
                  detail: "[M¹L⁰T⁻²] × [M¹L⁻³T⁰] / ([M⁰L¹T⁰] × [M⁰L¹T⁻²]) = [M²L⁻⁵T⁰].",
                  formula: "2*T*d/(r*g*cos(theta))",
                },
              ],
              verify: {
                label: "h = 2Td/rg cos θ",
                equation: "h = 2*T*d/(r*g*cos(theta))",
                display: "h = 2Td/(rg cos θ)",
                expect: "incorrect",
                note: "Left [L¹] against right [M²L⁻⁵T²] — the powers do not balance.",
              },
            },
            {
              id: "ex6",
              number: 6,
              title: "Check two energy relations",
              problem: "Check the accuracy of the following relations: (i) E = mgh + ½mv² (ii) v³ − u² = 2as².",
              conclusion:
                "Relation (i) is correct — all three terms are energy. Relation (ii) is wrong, because v³ and u² have different dimensions and so cannot be subtracted.",
              steps: [
                {
                  title: "(i) Left-hand side",
                  detail: "Energy E = [M¹L²T⁻²].",
                },
                {
                  title: "(i) mgh",
                  detail: "[M] × [LT⁻²] × [L] = [M¹L²T⁻²].",
                  formula: "m*g*h",
                },
                {
                  title: "(i) ½mv²",
                  detail: "[M] × [LT⁻¹]² = [M¹L²T⁻²].",
                  formula: "1/2*m*v2",
                },
                {
                  title: "(ii) v³",
                  detail: "[LT⁻¹]³ = [M⁰L³T⁻³].",
                  formula: "v3",
                },
                {
                  title: "(ii) u²",
                  detail: "[LT⁻¹]² = [M⁰L²T⁻²]. This does not match v³, so the subtraction itself is invalid.",
                  formula: "u2",
                },
              ],
              verify: {
                label: "v³ − u² = 2as²",
                equation: "v3-u2 = 2*a*s2",
                display: "v³ − u² = 2as²",
                expect: "incorrect",
              },
            },
            {
              id: "ex7",
              number: 7,
              title: "Dimensions of the constants a, b and c",
              problem:
                "The velocity of a particle is given in terms of time t by the equation v = At + b/t + c. What are the dimensions of a, b and c?",
              conclusion:
                "[a] = [L¹T⁻²] and [c] = [T¹]. The dimension of b is not uniquely fixed by dimensional analysis alone, because b/t and c must both share the dimensions of v.",
              steps: [
                {
                  title: "Start from the left-hand side",
                  detail: "Velocity is [L¹T⁻¹], so every term on the right must be a velocity as well.",
                },
                {
                  title: "Match At against v",
                  detail: "[A]·[T¹] = [L¹T⁻¹], so [A] = [L¹T⁻²].",
                  formula: "A*t",
                },
                {
                  title: "Match c against t",
                  detail: "c is added to time in the rearrangement, so c has the dimensions of time: [c] = [T¹].",
                },
                {
                  title: "Where b stops being determined",
                  detail:
                    "Writing b/t + c = v − At = [L¹T⁻¹] − [L¹T⁻¹] = 0 leaves b/t = −c, so [b] follows from [c] rather than independently. Dimensional analysis cannot fix b on its own — a physical argument is needed.",
                  formula: "b/t",
                },
              ],
              verify: {
                label: "v = At + b/t + c",
                equation: "v = A*t + b/t + c",
                display: "v = At + b/t + c",
                solveFor: ["A", "b", "c"],
                note: "The engine reports this as under-determined rather than inventing a value for b.",
              },
            },
            {
              id: "ex8",
              number: 8,
              title: "Dimensions of a and b in the gas equation",
              problem:
                "In the gas equation (P + a/v²)(v − b) = RT, where T is the absolute temperature, P is pressure and v is the volume of gas, what are the dimensions of a and b?",
              conclusion:
                "[a] = [M¹L⁵T⁻²] and [b] = [M⁰L³T⁰].",
              steps: [
                {
                  title: "Only like quantities are added or subtracted",
                  detail:
                    "P + a/v² is a sum of like quantities, so a/v² must have the dimensions of pressure, [ML⁻¹T⁻²].",
                },
                {
                  title: "Solve for a",
                  detail: "[a] = [ML⁻¹T⁻²] × [volume]² = [ML⁻¹T⁻²][L³]² = [ML⁻¹T⁻²][L⁶] = [ML⁵T⁻²].",
                  formula: "P*v2",
                },
                {
                  title: "Now the second bracket",
                  detail: "v − b has the dimensions of volume, so b must itself have the dimensions of volume, [M⁰L³T⁰].",
                  formula: "v-v",
                },
              ],
              verify: {
                label: "Gas equation",
                equation: "(P + a/v2)*(v - b) = R*T",
                display: "(P + a/v²)(v − b) = RT",
                symbols: gasEquationSymbols,
                solveFor: ["a", "b"],
                note: "The lab solves this directly by matching the bracketed sums.",
              },
            },
            {
              id: "ex9",
              number: 9,
              title: "Convert 1 newton into dyne",
              problem: "Convert a force of 1 newton to dyne.",
              conclusion: "1 N = 10⁵ dyne.",
              steps: [
                {
                  title: "Set up the conversion",
                  detail:
                    "Use Q = n₁u₁ = n₂u₂, so n₂ = n₁u₁/u₂, with n₁ = 1 and u₁ = 1 N.",
                },
                {
                  title: "Write out the powers",
                  detail:
                    "n₂ = n₁ (M₁/M₂)¹ (L₁/L₂)¹ (T₁/T₂)⁻², substituting kg and g for mass, and m and cm for length.",
                },
                {
                  title: "Apply the factors",
                  detail: "1 kg = 1000 g and 1 m = 100 cm, so n₂ = 1 × 1000 × 100.",
                },
              ],
            },
            {
              id: "ex10",
              number: 10,
              title: "Convert 1 erg into joule",
              problem: "Convert work of 1 erg into joule.",
              conclusion: "1 erg = 10⁻⁷ joule.",
              steps: [
                {
                  title: "Work in reverse",
                  detail:
                    "Here the erg is the first unit (n₁ = 1, u₁ = erg) and the joule is the second, since we are converting from CGS to MKS.",
                },
                {
                  title: "Write out the powers",
                  detail: "n₂ = n₁ (M₁/M₂)¹ (L₁/L₂)² (T₁/T₂)⁻² = 1 × (g/kg)(cm/m)²(s/s)⁻².",
                },
                {
                  title: "Apply the factors",
                  detail:
                    "1 kg = 1000 g gives 10⁻³ and 1 m = 100 cm gives 10⁻², so n₂ = 1 × 10⁻³ × 10⁻² × 10⁻².",
                },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================ */
    {
      id: "quiz",
      number: "1.10",
      title: "MCQ Quiz",
      summary: "The chapter's multiple choice questions, with explanations.",
      blocks: [
        {
          kind: "quiz",
          quiz: {
            title: "Chapter 1 Quiz",
            description:
              "Five questions from the chapter exercises. Pick an answer to see whether it is right and why.",
            questions: [
              {
                id: "q1",
                question: "[ML⁻¹T⁻²] is the dimensional formula of:",
                options: [
                  "Force",
                  "Coefficient of friction",
                  "Modulus of elasticity",
                  "Energy",
                ],
                answer: 2,
                explanation:
                  "Modulus of elasticity is stress / strain. Stress is [M¹L⁻¹T⁻²] and strain is dimensionless, so the modulus keeps [M¹L⁻¹T⁻²]. Note that pressure and stress have the same dimensions too, but they are not offered here.",
              },
              {
                id: "q2",
                question: "10⁵ fermi is equal to:",
                options: ["1 metre", "100 micron", "1 angstrom", "1 mm"],
                answer: 2,
                explanation:
                  "1 fermi = 10⁻¹⁵ m, so 10⁵ fermi = 10⁻¹⁰ m. One angstrom is exactly 10⁻¹⁰ m.",
              },
              {
                id: "q3",
                question: "rad / sec is the unit of:",
                options: [
                  "Angular displacement",
                  "Angular velocity",
                  "Angular acceleration",
                  "Angular momentum",
                ],
                answer: 1,
                explanation:
                  "Angular velocity = angle / time. Since the radian is dimensionless, its dimension is [M⁰L⁰T⁻¹].",
              },
              {
                id: "q4",
                question: "What is the unit for measuring the amplitude of a sound?",
                options: ["Decibel", "Coulomb", "Hum", "Cycles"],
                answer: 0,
                explanation:
                  "The decibel is the unit used to express the amplitude, or intensity level, of sound. The coulomb measures electric charge and the cycle measures frequency.",
              },
              {
                id: "q5",
                question:
                  "The displacement of a particle moving along the x-axis with respect to time is x = at + bt² − ct³. The dimension of c is:",
                options: ["LT⁻²", "T⁻³", "LT⁻³", "L⁰T⁻³"],
                answer: 2,
                explanation:
                  "Every term must be a displacement [L¹]. ct³ has dimension [c]·[T³] = [L¹], so [c] = [L¹T⁻³].",
              },
            ],
          },
        },
        {
          kind: "shortAnswer",
          heading: "Short Answer Questions",
          items: [
            {
              id: "sa1",
              question: "Define physics.",
              answer:
                "Physics is the branch of science dealing with the study of nature and the properties of matter and energy. Since it measures quantities as accurately as possible, it can also be called the science of measurement.",
            },
            {
              id: "sa2",
              question: "What do you mean by a physical quantity?",
              answer:
                "All quantities in terms of which the laws of physics can be expressed, and which can be measured, are called physical quantities — for example distance, speed, mass and force.",
            },
            {
              id: "sa3",
              question: "Differentiate between fundamental and derived units.",
              answer:
                "A fundamental unit is independent of other quantities and belongs to a fundamental quantity, such as the metre, kilogram or second. A derived unit belongs to a derived quantity and is obtained by combining fundamental units, such as the newton (kg·m·s⁻²) or the joule (kg·m²·s⁻²).",
            },
            {
              id: "sa4",
              question: "Write the full form of CGS, FPS and MKS.",
              answer:
                "CGS: Centimetre–Gram–Second. FPS: Foot–Pound–Second. MKS: Metre–Kilogram–Second.",
            },
            {
              id: "sa5",
              question: "Write the definition of dimensions.",
              answer:
                "Dimensions are the powers to which the fundamental units of mass, length and time, written as M, L and T, are raised. They express the nature of a physical quantity and not its magnitude.",
            },
            {
              id: "sa6",
              question:
                "What is a suitable unit for measuring the distance between the Sun and the Earth?",
              answer:
                "The astronomical unit (AU) is used, where 1 AU ≈ 1.496 × 10¹¹ m. A light year (1 ly = 9.46 × 10¹⁵ m) is far too large for this distance.",
            },
            {
              id: "sa7",
              question:
                "Write the dimensional formula of momentum, power, surface tension and strain.",
              answer:
                "Momentum = [M¹L¹T⁻¹]; Power = [M¹L²T⁻³]; Surface tension = [M¹L⁰T⁻²]; Strain = [M⁰L⁰T⁰] (dimensionless).",
            },
            {
              id: "sa8",
              question: "What is the principle of homogeneity of dimensions?",
              answer:
                "It states that the dimensions of all the terms on both sides of a physical equation must be the same, so that only like quantities can be added, subtracted or compared.",
            },
            {
              id: "sa9",
              question: "Write the SI and CGS units of force and work.",
              answer:
                "Force — SI: newton (N) = kg·m·s⁻²; CGS: dyne = g·cm·s⁻². Work — SI: joule (J) = N·m; CGS: erg = dyne·cm. Note that 1 N = 10⁵ dyne and 1 J = 10⁷ erg.",
            },
            {
              id: "sa10",
              question: "What are the uses of dimensions?",
              answer:
                "Dimensional analysis is used to check the correctness of a physical equation, to convert a physical quantity from one system of units into another, and to derive a relation among various physical quantities.",
            },
          ],
        },
      ],
    },
  ],
};
