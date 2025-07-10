
export const testDetailsHelp = [
  {
    title: "Test Name",
    content: "Choose a descriptive name that clearly identifies the test content. Examples: 'Algebra Basics Module 1', 'Reading Comprehension - Fiction Stories', 'SAT Math Practice Test 1'.",
    type: "info" as const
  },
  {
    title: "Subject Selection",
    content: "Math tests support all question types (MCQ, Numeric, Image, Paragraph). English tests are limited to Multiple Choice Questions (MCQs) only due to standardized testing requirements.",
    type: "info" as const
  },
  {
    title: "Difficulty Levels",
    content: "Easy: Basic concepts, simpler language. Medium: Standard difficulty, balanced complexity. Hard: Advanced concepts, challenging problems. Choose based on your target student level.",
    type: "tip" as const
  },
  {
    title: "Duration Guidelines",
    content: "Recommended durations: 30-45 min for practice tests, 60-90 min for comprehensive assessments. Consider 1-2 minutes per MCQ, 3-5 minutes for complex problems.",
    type: "tip" as const
  },
  {
    title: "Plan Requirements",
    content: "Free: Basic tests only. Basic: Standard features. Standard: Advanced analytics. Premium: All features including adaptive testing. Choose based on features needed.",
    type: "info" as const
  }
];

export const moduleHelp = [
  {
    title: "What are Modules?",
    content: "Modules represent different difficulty levels in adaptive testing. Students start with Module 1 (Medium) and advance or step back based on performance.",
    type: "info" as const
  },
  {
    title: "Module 1 (Medium)",
    content: "The starting point for all students. Contains moderate difficulty questions. Students scoring above the threshold advance to Module 2, below go to Module 3.",
    type: "info" as const
  },
  {
    title: "Module 2 (Hard)",
    content: "For high-performing students who exceed the threshold in Module 1. Contains challenging questions that test advanced understanding.",
    type: "info" as const
  },
  {
    title: "Module 3 (Easy)",
    content: "For students who need additional support. Contains easier questions to build confidence and assess foundational knowledge.",
    type: "info" as const
  },
  {
    title: "Adaptive Threshold",
    content: "Set the percentage score needed to advance from Module 1 to Module 2. Typical range: 60-80%. Higher thresholds make advancement more selective.",
    type: "tip" as const
  },
  {
    title: "Best Practices",
    content: "Start with 70% threshold and adjust based on student performance data. Ensure Module 2 is significantly harder than Module 1 to properly differentiate high performers.",
    type: "tip" as const
  }
];

export const passageHelp = [
  {
    title: "Reading Passage Requirements",
    content: "English tests require a reading passage that students will reference to answer questions. The passage should be appropriate for the target grade level.",
    type: "info" as const
  },
  {
    title: "Passage Length Guidelines",
    content: "Elementary: 150-300 words. Middle School: 300-500 words. High School: 500-800 words. Longer passages require more reading time in your duration calculation.",
    type: "tip" as const
  },
  {
    title: "Content Types",
    content: "Fiction: Stories, poems, plays. Non-fiction: Articles, essays, biographies, scientific texts. Choose based on skills you want to assess (literary analysis vs. informational reading).",
    type: "info" as const
  },
  {
    title: "Adding Images",
    content: "Images can enhance comprehension for scientific passages, historical texts, or visual poetry. Ensure images are clear and support the passage content.",
    type: "tip" as const
  },
  {
    title: "Quality Check",
    content: "Proofread for grammar and spelling errors. Ensure the passage has enough content to support multiple questions without being repetitive.",
    type: "warning" as const
  }
];

export const questionsHelp = [
  {
    title: "Question Types Overview",
    content: "MCQ: Multiple choice with 4 options (A-D). Numeric: Students enter numbers. Image: Include visual elements. Paragraph: Long-form responses. English tests support MCQ only.",
    type: "info" as const
  },
  {
    title: "Writing Good MCQs",
    content: "Make all options plausible. Avoid 'all of the above' or 'none of the above'. Keep options similar in length. Include common misconceptions as wrong answers.",
    type: "tip" as const
  },
  {
    title: "Point Values",
    content: "Standard: 1 point per question. Complex problems: 2-3 points. Keep total points reasonable (20-50 for most tests). Higher points = more weight in final score.",
    type: "info" as const
  },
  {
    title: "Question Quality",
    content: "Write clear, concise questions. Avoid trick questions unless testing careful reading. Include explanations to help student learning after the test.",
    type: "tip" as const
  },
  {
    title: "Common Mistakes",
    content: "Empty options in MCQs, vague question wording, missing correct answers, unrealistic point values. Always preview your test before saving.",
    type: "warning" as const
  },
  {
    title: "Numeric Questions (Math only)",
    content: "Accept decimal answers when appropriate. Consider margin of error for calculations. Provide clear units in the question if needed (e.g., 'Answer in meters').",
    type: "tip" as const
  }
];
