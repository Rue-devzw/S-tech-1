export const CONTACT_TOPICS = [
  {
    value: "strategy",
    label: "Project discovery",
    description: "Clarify the structure, audience, and direction before the build starts.",
    listingId: "st-001",
  },
  {
    value: "platforms",
    label: "Website or platform build",
    description: "Design or improve a website, agency platform, or client-facing digital experience.",
    listingId: "st-002",
  },
  {
    value: "ai",
    label: "Content collection",
    description: "Organize hymns, archives, or structured content into a clearer digital experience.",
    listingId: "st-003",
  },
  {
    value: "data",
    label: "Refinement and improvements",
    description: "Improve an existing site with better structure, presentation, and usability.",
    listingId: "st-001",
  },
  {
    value: "general",
    label: "General inquiry",
    description: "Discuss a project that does not fit neatly into one category.",
    listingId: "st-002",
  },
] as const;

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map(
  (topic) => topic.value
) as [
  (typeof CONTACT_TOPICS)[number]["value"],
  ...(typeof CONTACT_TOPICS)[number]["value"][],
];

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];

export function isContactTopicValue(
  value: string | undefined
): value is ContactTopicValue {
  return CONTACT_TOPICS.some((topic) => topic.value === value);
}

export function getContactTopic(value: ContactTopicValue) {
  return CONTACT_TOPICS.find((topic) => topic.value === value) ?? CONTACT_TOPICS[0];
}

export function getListingIdForContactTopic(value: ContactTopicValue) {
  return getContactTopic(value).listingId;
}
