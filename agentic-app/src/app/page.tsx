 "use client";

import { useMemo, useState } from "react";

type Regulation = {
  id: string;
  label: string;
  description: string;
};

const REGULATIONS: Regulation[] = [
  {
    id: "arrete25juin1980",
    label: "Arrêté du 25 juin 1980 (ERP)",
    description:
      "Règlement de sécurité contre l'incendie dans les ERP (dispositions générales).",
  },
  {
    id: "arrete22juin1990",
    label: "Arrêté du 22 juin 1990 (habitations)",
    description:
      "Protection contre l'incendie des bâtiments d'habitation (si applicable aux logements).",
  },
  {
    id: "arrete11sept2007",
    label: "Arrêté du 11 septembre 2007 (accessibilité ERP)",
    description:
      "Accessibilité pour les ERP neufs et existants, dispositions générales.",
  },
  {
    id: "codeConstruction",
    label: "Code de la construction et de l'habitation",
    description:
      "Articles R.123 et L.111 relatifs à la sécurité incendie et à l'accessibilité.",
  },
  {
    id: "arrete8dec2014",
    label: "Arrêté du 8 décembre 2014 (accessibilité ERP existants)",
    description:
      "Dispositions spécifiques relatives à la mise en accessibilité des ERP existants.",
  },
];

type FormState = {
  projectName: string;
  projectPhase: string;
  address: string;
  city: string;
  owner: string;
  architect: string;
  mission: string;
  erpCategory: string;
  erpType: string;
  erpGroup: string;
  surface: string;
  levels: string;
  occupancy: string;
  capacity: string;
  structuralDescription: string;
  worksNature: string;
  fireCompartments: string;
  detectionSystems: string;
  suppressionSystems: string;
  smokeControlSystems: string;
  evacuationMeans: string;
  interventionAccess: string;
  maintenancePolicy: string;
  accessibilityAccess: string;
  accessibilityCirculation: string;
  accessibilitySanitary: string;
  accessibilityCommunication: string;
  accessibilityManagement: string;
  schedule: string;
  observations: string;
  selectedRegulations: string[];
};

const DEFAULT_REGULATION_IDS = REGULATIONS.filter((regulation) =>
  ["arrete25juin1980", "arrete11sept2007"].includes(regulation.id),
).map((regulation) => regulation.id);

const initialState: FormState = {
  projectName: "",
  projectPhase: "",
  address: "",
  city: "",
  owner: "",
  architect: "",
  mission: "Mission complète",
  erpCategory: "5",
  erpType: "",
  erpGroup: "1",
  surface: "",
  levels: "",
  occupancy: "",
  capacity: "",
  structuralDescription: "",
  worksNature: "",
  fireCompartments: "",
  detectionSystems: "",
  suppressionSystems: "",
  smokeControlSystems: "",
  evacuationMeans: "",
  interventionAccess: "",
  maintenancePolicy: "",
  accessibilityAccess: "",
  accessibilityCirculation: "",
  accessibilitySanitary: "",
  accessibilityCommunication: "",
  accessibilityManagement: "",
  schedule: "",
  observations: "",
  selectedRegulations:
    DEFAULT_REGULATION_IDS.length > 0
      ? DEFAULT_REGULATION_IDS
      : [REGULATIONS[0]?.id ?? ""],
};

type NoticeSection = {
  title: string;
  content: string;
};

function buildNoticeSections(
  sections: NoticeSection[],
  title: string,
): string {
  const header = `# ${title}`;
  const body = sections
    .filter((section) => section.content.trim().length > 0)
    .map(
      (section) =>
        `## ${section.title}\n${section.content.trim().replace(/\n{2,}/g, "\n\n")}`,
    )
    .join("\n\n");

  return `${header}\n\n${body}`.trim();
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialState);
  const [copiedId, setCopiedId] = useState<"incendie" | "accessibilite" | null>(
    null,
  );

  const writeValue = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRegulation = (regulationId: string) => {
    setForm((prev) => {
      const exists = prev.selectedRegulations.includes(regulationId);
      return {
        ...prev,
        selectedRegulations: exists
          ? prev.selectedRegulations.filter((id) => id !== regulationId)
          : [...prev.selectedRegulations, regulationId],
      };
    });
  };

  const fireNotice = useMemo(() => {
    const regulations = form.selectedRegulations
      .map((id) => REGULATIONS.find((reg) => reg.id === id))
      .filter(Boolean)
      .map((reg) => `- ${reg?.label} : ${reg?.description}`)
      .join("\n");

    const sections: NoticeSection[] = [
      {
        title: "Présentation du projet",
        content: [
          `Intitulé : ${form.projectName || "À préciser"}`,
          form.projectPhase && `Phase : ${form.projectPhase}`,
          form.address && `Adresse : ${form.address}`,
          form.city && `Commune : ${form.city}`,
          form.owner && `Maître d'ouvrage : ${form.owner}`,
          form.architect && `Maître d'œuvre : ${form.architect}`,
          form.mission && `Mission : ${form.mission}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        title: "Cadre réglementaire",
        content: regulations || "Réglementations applicables à préciser.",
      },
      {
        title: "Caractéristiques de l'ERP",
        content: [
          form.erpType && `Type : ${form.erpType}`,
          `Groupe : ${form.erpGroup || "À préciser"}`,
          `Catégorie : ${form.erpCategory || "À préciser"}`,
          form.surface && `Surface utile : ${form.surface}`,
          form.levels && `Nombre de niveaux : ${form.levels}`,
          form.capacity && `Effectif admis : ${form.capacity}`,
          form.occupancy && `Occupation : ${form.occupancy}`,
          form.structuralDescription &&
            `Structure porteuse et stabilité : ${form.structuralDescription}`,
          form.worksNature && `Nature des travaux : ${form.worksNature}`,
          form.fireCompartments &&
            `Compartimentage et degré coupe-feu : ${form.fireCompartments}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        title: "Moyens de détection et d'alarme",
        content:
          form.detectionSystems ||
          "Description des systèmes d'alarme et détection à compléter.",
      },
      {
        title: "Moyens d'extinction",
        content:
          form.suppressionSystems ||
          "Description des moyens d'extinction (RIA, extincteurs, sprinklers...) à compléter.",
      },
      {
        title: "Désenfumage et compartimentage",
        content:
          form.smokeControlSystems ||
          "Dispositifs de désenfumage naturel ou mécanique à détailler.",
      },
      {
        title: "Conditions d'évacuation",
        content:
          form.evacuationMeans ||
          "Préciser les dégagements, escaliers, issues de secours, signalétique et éclairage.",
      },
      {
        title: "Accès des secours",
        content:
          form.interventionAccess ||
          "Compléter les conditions d'accès et d'intervention des services de secours.",
      },
      {
        title: "Exploitation et maintenance",
        content:
          form.maintenancePolicy ||
          "Préciser les procédures de maintenance, consignes de sécurité et formation du personnel.",
      },
      {
        title: "Observations complémentaires",
        content: form.observations,
      },
      {
        title: "Planning prévisionnel",
        content:
          form.schedule || "Calendrier prévisionnel des travaux à compléter.",
      },
    ];

    return buildNoticeSections(sections, "Notice de sécurité incendie");
  }, [form]);

  const accessibilityNotice = useMemo(() => {
    const regulations = form.selectedRegulations
      .map((id) => REGULATIONS.find((reg) => reg.id === id))
      .filter(Boolean)
      .map((reg) => `- ${reg?.label} : ${reg?.description}`)
      .join("\n");

    const sections: NoticeSection[] = [
      {
        title: "Présentation du projet",
        content: [
          `Intitulé : ${form.projectName || "À préciser"}`,
          form.projectPhase && `Phase : ${form.projectPhase}`,
          form.address && `Adresse : ${form.address}`,
          form.city && `Commune : ${form.city}`,
          form.owner && `Maître d'ouvrage : ${form.owner}`,
          form.architect && `Maître d'œuvre : ${form.architect}`,
          form.mission && `Mission : ${form.mission}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        title: "Cadre réglementaire",
        content: regulations || "Réglementations applicables à préciser.",
      },
      {
        title: "Principe d'accessibilité",
        content:
          form.accessibilityAccess ||
          "Préciser l'accès principal, les cheminements extérieurs, stationnements PMR et obstacles éventuels.",
      },
      {
        title: "Cheminements intérieurs",
        content:
          form.accessibilityCirculation ||
          "Décrire les circulations horizontales et verticales, largeurs, pentes, ascenseurs, mains courantes.",
      },
      {
        title: "Sanitaires et locaux adaptés",
        content:
          form.accessibilitySanitary ||
          "Indiquer l'équipement des sanitaires, vestiaires, chambres ou autres locaux spécifiques.",
      },
      {
        title: "Communication et signalétique",
        content:
          form.accessibilityCommunication ||
          "Préciser les dispositifs de signalétique, contrastes, boucles magnétiques, affichages sonores et visuels.",
      },
      {
        title: "Gestion et organisation",
        content:
          form.accessibilityManagement ||
          "Compléter les modalités d'accompagnement, d'entretien et de gestion des demandes d'aménagement.",
      },
      {
        title: "Observations complémentaires",
        content: form.observations,
      },
    ];

    return buildNoticeSections(
      sections,
      "Notice d'accessibilité aux personnes handicapées",
    );
  }, [form]);

  const handleCopy = async (
    content: string,
    id: "incendie" | "accessibilite",
  ) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Erreur de copie :", error);
    }
  };

  const downloadAsMarkdown = (
    content: string,
    filename: string,
  ) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-neutral-950 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-12 space-y-4">
          <p className="text-sm uppercase tracking-wide text-neutral-400">
            Assistant notices réglementaires
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Générateur de notices sécurité incendie & accessibilité
          </h1>
          <p className="max-w-3xl text-neutral-300">
            Renseignez les caractéristiques de votre projet d&apos;architecture
            pour produire des notices réglementaires prêtes à être transmises au
            bureau de contrôle. Les textes générés sont formatés en Markdown
            pour faciliter vos exports et retouches.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <form className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Informations générales
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Intitulé de l'opération"
                  value={form.projectName}
                  onChange={(value) => writeValue("projectName", value)}
                  placeholder="Réhabilitation du centre socio-culturel"
                />
                <InputField
                  label="Phase / dossier"
                  value={form.projectPhase}
                  onChange={(value) => writeValue("projectPhase", value)}
                  placeholder="Permis de construire / Dossier d'autorisation ERP"
                />
                <InputField
                  label="Adresse"
                  value={form.address}
                  onChange={(value) => writeValue("address", value)}
                  placeholder="12 rue des Artisans"
                />
                <InputField
                  label="Commune"
                  value={form.city}
                  onChange={(value) => writeValue("city", value)}
                  placeholder="Nantes (44)"
                />
                <InputField
                  label="Maître d'ouvrage"
                  value={form.owner}
                  onChange={(value) => writeValue("owner", value)}
                  placeholder="Ville de Nantes"
                />
                <InputField
                  label="Maître d'œuvre"
                  value={form.architect}
                  onChange={(value) => writeValue("architect", value)}
                  placeholder="Atelier XYZ - Architectes"
                />
              </div>
              <TextAreaField
                label="Mission"
                value={form.mission}
                onChange={(value) => writeValue("mission", value)}
                placeholder="Mission complète loi MOP incluant suivi et VISA."
              />
              <TextAreaField
                label="Nature des travaux"
                value={form.worksNature}
                onChange={(value) => writeValue("worksNature", value)}
                placeholder="Restructuration intérieure et extension légère sur cour."
              />
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Paramètres ERP
              </legend>
              <div className="grid gap-4 md:grid-cols-3">
                <InputField
                  label="Type (ex : W, R, L...)"
                  value={form.erpType}
                  onChange={(value) => writeValue("erpType", value)}
                  placeholder="Type W - administrations"
                />
                <InputField
                  label="Groupe"
                  value={form.erpGroup}
                  onChange={(value) => writeValue("erpGroup", value)}
                  placeholder="Groupe 1"
                />
                <InputField
                  label="Catégorie"
                  value={form.erpCategory}
                  onChange={(value) => writeValue("erpCategory", value)}
                  placeholder="3"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Surface utile (m²)"
                  value={form.surface}
                  onChange={(value) => writeValue("surface", value)}
                  placeholder="1 250 m²"
                />
                <InputField
                  label="Nombre de niveaux"
                  value={form.levels}
                  onChange={(value) => writeValue("levels", value)}
                  placeholder="R+2 + sous-sol"
                />
                <InputField
                  label="Effectif admis"
                  value={form.capacity}
                  onChange={(value) => writeValue("capacity", value)}
                  placeholder="250 personnes (public + personnel)"
                />
                <InputField
                  label="Occupation"
                  value={form.occupancy}
                  onChange={(value) => writeValue("occupancy", value)}
                  placeholder="Bureaux, salles polyvalentes, locaux techniques"
                />
              </div>
              <TextAreaField
                label="Structure et stabilité au feu"
                value={form.structuralDescription}
                onChange={(value) => writeValue("structuralDescription", value)}
                placeholder="Structure mixte béton/acier, plancher CF 1h, façade coupe-feu vis-à-vis des tiers."
              />
              <TextAreaField
                label="Compartimentage"
                value={form.fireCompartments}
                onChange={(value) => writeValue("fireCompartments", value)}
                placeholder="Dégagements encloisonnés EI 60, locaux techniques isolés EI 120, cloisonnement des circulations."
              />
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Dispositifs de sécurité
              </legend>
              <TextAreaField
                label="Détection / alarme"
                value={form.detectionSystems}
                onChange={(value) => writeValue("detectionSystems", value)}
                placeholder="SSI de catégorie B, détection automatique dans les locaux sensibles, report du signal au PC sécurité."
              />
              <TextAreaField
                label="Moyens d'extinction"
                value={form.suppressionSystems}
                onChange={(value) => writeValue("suppressionSystems", value)}
                placeholder="Extincteurs à eau pulvérisée tous les 200 m², RIA DN 25 dans les circulations, volet coupe-feu automatique."
              />
              <TextAreaField
                label="Désenfumage"
                value={form.smokeControlSystems}
                onChange={(value) => writeValue("smokeControlSystems", value)}
                placeholder="Désenfumage naturel par exutoires en toiture, ventilation mécanique dans le sous-sol."
              />
              <TextAreaField
                label="Évacuation et éclairage"
                value={form.evacuationMeans}
                onChange={(value) => writeValue("evacuationMeans", value)}
                placeholder="Deux escaliers protégés, issues distantes, éclairage de sécurité SATI, balisage lumineux renforcé."
              />
              <TextAreaField
                label="Accès et intervention des secours"
                value={form.interventionAccess}
                onChange={(value) => writeValue("interventionAccess", value)}
                placeholder="Voie engins de 3,50 m en façade nord, aire de retournement conforme, colonne sèche en cage principale."
              />
              <TextAreaField
                label="Exploitation et maintenance"
                value={form.maintenancePolicy}
                onChange={(value) => writeValue("maintenancePolicy", value)}
                placeholder="Tenue du registre de sécurité, formations annuelles, essais trimestriels des dispositifs."
              />
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Accessibilité
              </legend>
              <TextAreaField
                label="Accès et stationnement"
                value={form.accessibilityAccess}
                onChange={(value) => writeValue("accessibilityAccess", value)}
                placeholder="Cheminement praticable depuis le stationnement PMR, ressauts inférieurs à 2 cm, interphone visio."
              />
              <TextAreaField
                label="Circulations intérieures"
                value={form.accessibilityCirculation}
                onChange={(value) =>
                  writeValue("accessibilityCirculation", value)
                }
                placeholder="Largeur utile 1,40 m, portes 0,90 m, ascenseur adapté avec répétition visuelle et sonore."
              />
              <TextAreaField
                label="Sanitaires et locaux adaptés"
                value={form.accessibilitySanitary}
                onChange={(value) => writeValue("accessibilitySanitary", value)}
                placeholder="Sanitaires PMR à chaque niveau, barres d'appui latérales, surfaces de giration conformes."
              />
              <TextAreaField
                label="Communication et signalétique"
                value={form.accessibilityCommunication}
                onChange={(value) =>
                  writeValue("accessibilityCommunication", value)
                }
                placeholder="Signalétique contrastée, pictogrammes normalisés, boucle magnétique à l'accueil."
              />
              <TextAreaField
                label="Gestion et accompagnement"
                value={form.accessibilityManagement}
                onChange={(value) =>
                  writeValue("accessibilityManagement", value)
                }
                placeholder="Procédure d'accueil spécifique, sensibilisation du personnel, plan de maintenance des équipements."
              />
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Compléments
              </legend>
              <TextAreaField
                label="Observations complémentaires"
                value={form.observations}
                onChange={(value) => writeValue("observations", value)}
                placeholder="Points de vigilance issus des échanges avec le bureau de contrôle."
              />
              <TextAreaField
                label="Planning prévisionnel"
                value={form.schedule}
                onChange={(value) => writeValue("schedule", value)}
                placeholder="PC obtenu T2 2025, travaux T4 2025 - T4 2026, réception T1 2027."
              />
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6">
              <legend className="px-2 text-lg font-semibold">
                Références réglementaires
              </legend>
              <p className="text-sm text-neutral-300">
                Sélectionnez les textes applicables au projet. Ils seront
                rappelés dans les deux notices.
              </p>
              <div className="grid gap-4">
                {REGULATIONS.map((regulation) => {
                  const checked = form.selectedRegulations.includes(
                    regulation.id,
                  );
                  return (
                    <label
                      key={regulation.id}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/60 hover:bg-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRegulation(regulation.id)}
                        className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-emerald-400 focus:ring-emerald-400"
                      />
                      <span>
                        <span className="block font-semibold">
                          {regulation.label}
                        </span>
                        <span className="text-sm text-neutral-300">
                          {regulation.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </form>

          <aside className="space-y-6">
            <NoticeCard
              id="incendie"
              title="Notice sécurité incendie"
              content={fireNotice}
              copied={copiedId === "incendie"}
              onCopy={() => handleCopy(fireNotice, "incendie")}
              onDownload={() =>
                downloadAsMarkdown(fireNotice, "notice-securite-incendie.md")
              }
            />
            <NoticeCard
              id="accessibilite"
              title="Notice accessibilité"
              content={accessibilityNotice}
              copied={copiedId === "accessibilite"}
              onCopy={() => handleCopy(accessibilityNotice, "accessibilite")}
              onDownload={() =>
                downloadAsMarkdown(
                  accessibilityNotice,
                  "notice-accessibilite.md",
                )
              }
            />
            <div className="rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-6">
              <h2 className="text-lg font-semibold text-emerald-200">
                Conseils d&apos;utilisation
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-emerald-100/80">
                <li>
                  Utilisez les zones de texte pour documenter précisément chaque
                  dispositif du projet.
                </li>
                <li>
                  Copiez ou téléchargez les notices pour les intégrer à vos
                  dossiers PC, AT ou vérifications bureau de contrôle.
                </li>
                <li>
                  Les contenus sont fournis en Markdown pour faciliter la mise
                  en page dans vos modèles de rapport.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-neutral-200">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      />
    </label>
  );
}

type TextAreaFieldProps = InputFieldProps;

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-neutral-200">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-28 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      />
    </label>
  );
}

type NoticeCardProps = {
  id: "incendie" | "accessibilite";
  title: string;
  content: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
};

function NoticeCard({
  id,
  title,
  content,
  copied,
  onCopy,
  onDownload,
}: NoticeCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            {id === "incendie" ? "Sécurité incendie" : "Accessibilité"}
          </p>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white transition hover:border-emerald-400/60 hover:bg-emerald-400/10"
          >
            {copied ? "Copié" : "Copier"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="rounded-xl border border-white/10 bg-emerald-500/20 px-4 py-2 text-xs font-medium uppercase tracking-wide text-emerald-100 transition hover:border-emerald-400/80 hover:bg-emerald-500/30"
          >
            Télécharger
          </button>
        </div>
      </header>
      <textarea
        readOnly
        value={content}
        className="min-h-[360px] flex-1 rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-neutral-100"
      />
      <p className="text-xs text-neutral-400">
        Les contenus sont générés à partir des informations saisies. Vérifiez et
        complétez avant transmission au bureau de contrôle.
      </p>
    </div>
  );
}
