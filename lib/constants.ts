export const ASSESSMENT_DOMAINS = [
  {
    id: "leadership_for_impact",
    name: "Leadership for Impact",
    description: "Assessing leadership's commitment to impact and social change.",
    questionCount: 5,
  },
  {
    id: "theory_of_change",
    name: "Theory of Change",
    description: "Evaluating the clarity and effectiveness of your theory of change.",
    questionCount: 5,
  },
  {
    id: "purpose_statement",
    name: "Purpose Statement",
    description: "Assessing the clarity and alignment of your organization's purpose.",
    questionCount: 5,
  },
  {
    id: "purpose_alignment",
    name: "Purpose Alignment",
    description: "Evaluating how well your activities align with your stated purpose.",
    questionCount: 5,
  },
  {
    id: "measurement_framework",
    name: "Measurement Framework",
    description: "Assessing your approach to measuring and reporting impact.",
    questionCount: 5,
  },
  {
    id: "status_of_data",
    name: "Status of Data",
    description: "Evaluating the quality and use of your impact data.",
    questionCount: 5,
  },
  {
    id: "details",
    name: "Project Details",
    description: "Basic information about your project.",
    questionCount: 0,
  },
]

// Sample questions for each domain - replace with your actual questions
export const DOMAIN_QUESTIONS = {
  leadership_for_impact: [
    {
      id: "leadership_1",
      question: "How committed is leadership to impact measurement?",
      guidance: "Consider the level of engagement from senior leadership in impact discussions.",
      options: [
        { value: 1, label: "Not committed" },
        { value: 10, label: "Fully committed" },
      ],
    },
    // Add more questions...
  ],
  theory_of_change: [
    {
      id: "toc_1",
      question: "How clear is your theory of change?",
      guidance: "Consider whether your theory of change clearly articulates how activities lead to outcomes.",
      options: [
        { value: 1, label: "Not clear" },
        { value: 10, label: "Very clear" },
      ],
    },
    // Add more questions...
  ],
  purpose_statement: [
    {
      id: "purpose_1",
      question: "How clear is your organization's purpose statement?",
      guidance: "Consider whether your purpose clearly articulates what you aim to achieve.",
      options: [
        { value: 1, label: "Not clear" },
        { value: 10, label: "Very clear" },
      ],
    },
    // Add more questions...
  ],
  purpose_alignment: [
    {
      id: "alignment_1",
      question: "How well do your activities align with your stated purpose?",
      guidance: "Consider whether your day-to-day work directly contributes to your purpose.",
      options: [
        { value: 1, label: "Poor alignment" },
        { value: 10, label: "Perfect alignment" },
      ],
    },
    // Add more questions...
  ],
  measurement_framework: [
    {
      id: "framework_1",
      question: "How comprehensive is your impact measurement framework?",
      guidance: "Consider whether you have clear metrics for all key outcomes.",
      options: [
        { value: 1, label: "Not comprehensive" },
        { value: 10, label: "Very comprehensive" },
      ],
    },
    // Add more questions...
  ],
  status_of_data: [
    {
      id: "data_1",
      question: "How would you rate the quality of your impact data?",
      guidance: "Consider accuracy, completeness, and reliability of your data.",
      options: [
        { value: 1, label: "Poor quality" },
        { value: 10, label: "Excellent quality" },
      ],
    },
    // Add more questions...
  ],
  systems_capabilities: [
    {
      id: "sc_1",
      question: "Is the number of systems being operated appropriate for the organisation?",
      guidance: "",
      inverted: false,
    },
    {
      id: "sc_2",
      question: "Are the systems modern and fit for purpose?",
      guidance: "",
      inverted: false,
    },
    {
      id: "sc_3",
      question: "Does the organisation have the appropriate personnel and support in place to run their systems?",
      guidance: "",
      inverted: false,
    },
    {
      id: "sc_4",
      question: "Is it possible for the client to customise impact relevant systems without external support services?",
      guidance: "",
      inverted: false,
    },
    {
      id: "sc_5",
      question: "If applicable, Are your systems able interact with each other?",
      guidance: "",
      inverted: false,
    },
  ],
}

export const DEFAULT_SCORE_OPTIONS = [
  { value: 0, label: "0 - Not at all" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10 - Extremely" },
]

export const getScoreColor = (score: number) => {
  if (score <= 4) {
    return "text-red-600"
  } else if (score <= 7) {
    return "text-amber-600"
  } else {
    return "text-green-600"
  }
}

export const getScoreBackgroundColor = (score: number) => {
  if (score <= 4) {
    return "rgba(232, 99, 99, 0.6)" // Red for low scores
  } else if (score <= 7) {
    return "rgba(255, 206, 86, 0.6)" // Amber for medium scores
  } else {
    return "rgba(75, 192, 192, 0.6)" // Green for high scores
  }
}
