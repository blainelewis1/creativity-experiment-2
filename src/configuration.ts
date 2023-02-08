import { range, shuffle, sum, times, zip } from "lodash";

import {
  Undo,
  Redo,
  Print,
  Spellcheck,
  FormatPaint,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  InsertLink,
  AddComment,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  // TODO: Checklist,
  FormatListBulleted,
  FormatListNumbered,
  FormatIndentDecrease,
  FormatIndentIncrease,
  // TODO: FormatClear
  FormatClear,
} from "emotion-icons/material";

import { MenuItem } from "@blainelewis1/menus";

import ConsentLetter from "./consent";
import { getAllMetadata } from "@hcikit/workflow";

let beginScreen = {
  task: "BeginScreen",
  content: `The next screen contains a timed task where you will be given an object and must think of unusual uses for it. Please read the instructions on the page carefully and use the full allotted time to complete the task. The prompt will look like:

> Write down all of the original and creative uses for a {object} that you can think of. There are common, unoriginal ways to use a {object}; for this task, write down all of the unusual, creative, and uncommon uses you can think of.`,
};

const objects = shuffle(["newspaper", "knife", "brick", "shoe"]);
const menus = shuffle([
  "KeyboardShortcutsWithCheatsheet",
  "ToolPalette",
  "MarkingMenu",
]);

const menuMappings: Record<string, string> = {
  KeyboardShortcutsWithCheatsheet: "keyboard shortcuts",
  ToolPalette: "tool palette",
  MarkingMenu: "marking menu",
};

// TODO: add shortcuts.
const items = [
  { icon: Undo, label: "Undo", angle: Math.PI, shortcut: "mod+z" },
  { icon: Redo, label: "Redo", angle: 0, shortcut: "mod+y" },
  {
    items: [
      {
        icon: FormatPaint,
        label: "Paint format",
        // TODO: Idk if this is correct
        shortcut: "mod+r",
        angle: (5 * Math.PI) / 4,
      },
      {
        icon: FormatBold,
        label: "Bold",
        angle: Math.PI,
        shortcut: "mod+b",
      },
      {
        icon: FormatItalic,
        label: "Italic",
        angle: Math.PI / 2,
        shortcut: "mod+i",
      },
      {
        icon: FormatUnderlined,
        label: "Underline",
        angle: 0,
        shortcut: "mod+u",
      },
      {
        icon: FormatClear,
        label: "Clear formatting",
        angle: (7 * Math.PI) / 4,
        shortcut: "mod+\\",
      },
    ],
    unselectable: true,
    label: "Formatting",
    angle: (3 * Math.PI) / 2,
  },
  {
    items: [
      {
        icon: FormatAlignLeft,
        label: "Align Left",
        angle: Math.PI,
        shortcut: "mod+shift+l",
      },
      {
        icon: FormatAlignCenter,
        label: "Align Center",
        shortcut: "mod+shift+e",
        angle: (3 * Math.PI) / 2,
      },
      {
        icon: FormatAlignRight,
        label: "Align Right",
        shortcut: "mod+shift+r",
        angle: 0,
      },
      {
        icon: FormatAlignJustify,
        shortcut: "mod+shift+j",
        label: "Align Justify",
        angle: Math.PI / 2,
      },
    ],
    angle: (7 * Math.PI) / 4,
    unselectable: true,
    label: "Alignment",
  },
  // 20.
  {
    items: [
      {
        icon: Print,
        label: "Print",
        shortcut: "mod+p",
        angle: (3 * Math.PI) / 2,
      },
      {
        icon: Spellcheck,
        label: "Spellcheck",
        shortcut: "mod+alt+x",
        angle: Math.PI / 2,
      },
      {
        icon: InsertLink,
        label: "Insert link",
        shortcut: "mod+k",
        angle: Math.PI,
      },
      {
        icon: AddComment,
        label: "Add comment",
        shortcut: "mod+alt+m",
        angle: 0,
      },
    ],
    angle: (3 * Math.PI) / 4,
    unselectable: true,
    label: "Miscellaneous",
  },
  // { icon:  label:"//"}TODO: Checklist, shortcut: "mod+shift+9"},
  {
    items: [
      {
        icon: FormatListBulleted,
        label: "Bulleted list",
        shortcut: "mod+shift+8",
        angle: (5 * Math.PI) / 4,
      },
      {
        icon: FormatListNumbered,
        label: "Numbered list",
        shortcut: "mod+shift+7",
        angle: (7 * Math.PI) / 4,
      },
      {
        icon: FormatIndentDecrease,
        label: "Decrease indent",
        shortcut: "mod+[",
        angle: Math.PI,
      },
      {
        icon: FormatIndentIncrease,
        label: "Increase indent",
        shortcut: "mod+]",
        angle: 0,
      },
    ],
    angle: Math.PI / 2,
    unselectable: true,
    label: "Lists + Indent",
  },
];

export function* iterateMenu(items: Array<MenuItem>) {
  let queue = items;

  while (queue.length > 0) {
    const next = queue.pop() as MenuItem;

    if (!next.unselectable) {
      yield next;
    }

    if (next.items) {
      queue = queue.concat(next.items);
    }
  }

  return;
}

let ranking = [
  "Undo",
  "Italic",
  "Bold",
  "Redo",
  "Insert link",
  "Underline",
  "Print",
  "Numbered list",
  "Bulleted list",
  "Add comment",
  "Paint format",
  "Align Left",
  "Align Center",
  "Align Justify",
  "Align Right",
  "Spellcheck",
  "Increase indent",
  "Decrease indent",
  "Clear formatting",
];

function zipfian(numberOfItems: number, s: number = 1): Array<number> {
  let harmonicNumber = sum(
    range(1, numberOfItems).map((n) => 1 / Math.pow(n, s))
  );

  let distribution = [];

  for (let k of range(1, numberOfItems + 1)) {
    distribution.push(1 / Math.pow(k, s) / harmonicNumber);
  }

  return distribution;
}

const occurrenceCounts = zipfian(ranking.length, 1).map((k) =>
  Math.floor(k * 59)
);

const distributedItems = zip(occurrenceCounts, ranking)
  .map(([count, item]) => times(count ?? 0, () => item ?? ""))
  .flat();

const url = new URL(window.location.href);
const participant_id =
  url.searchParams.get("participant_id") ||
  url.searchParams.get("PROLIFIC_PID") ||
  "unknown";

const study_id = url.searchParams.get("STUDY_ID") || "unknown";
const session_id = url.searchParams.get("SESSION_ID") || "unknown";

// http://creativity-experiment-1-websitebucket-y1wyp6druyor.s3-website.us-east-2.amazonaws.com/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}

const conditions = zip(objects.slice(1), menus).map(([object, menu]) => {
  return {
    menu,
    items,
    children: [
      { task: "Tutorial" },
      {
        menu: menu,
        task: "CommandSelection",
        children: shuffle(distributedItems).flatMap((item) => [
          {
            task: "MousePositioning",
            y: Math.random() * 400 - 200,
            x: Math.random() * 400 - 200,
          },
          // {
          //   task: "TypingTask",
          //   prompt: item,
          //   command: item,
          // },

          {
            command: item,
          },
        ]),
      },
      beginScreen,
      {
        task: "DivergentTest",
        question: `Write down all of the original and creative
        uses for a ${object} that you can think of. There are common,
        unoriginal ways to use a ${object}; for this task, write down all of the
        unusual, creative, and uncommon uses you can think of.`,
        object,
        // timeLimit: 60 * 1000 * 0.5,
        timeLimit: 60 * 1000 * 3,
      },
      {
        task: "Questionnaire",
        questions: [
          "I felt creative while I was selecting commands.",
          `Using a ${
            menuMappings[menu as string]
          } within a content creation tool (drawing, writing, etc.) would help me be creative.`,
        ],
      },
      { task: "NasaTlx" },
      // { task: "CreativitySupportIndex" },
    ],
  };
});

const configuration = {
  participant_id,
  metadata: {
    ...getAllMetadata(),
    git_commit: process.env.REACT_APP_GIT_HASH,
    package_version: process.env.REACT_APP_PACKAGE_VERSION,
    build_time: process.env.REACT_APP_BUILD_TIME,
    session_id,
    study_id,
    participant_id,
  },
  version: "prolific-pilot@1",
  tasks: ["ProgressBar", "ResolutionChecker", "DevTools"],
  ResolutionChecker: {
    minXResolution: 900,
    minYResolution: 700,
  },
  // DevTools: { showInProduction: true },
  children: [
    {
      task: "ConsentForm",

      content: ConsentLetter,
      questions: [
        {
          label: "I understand and consent to the above.",
          required: true,
        },
        // {
        //   label:
        //     "Yes: Video and audio recordings or frame grabs of the session may be used.",
        //   required: false,
        // },
        // {
        //   label:
        //     "No: Video and audio recordings or frame grabs of the session may not be used.",
        //   required: false,
        // },
      ],
    },
    {
      task: "BeginScreen",
      content: `
# Menu Creativity Experiment

This experiment will test your creativity while using different computer menus. You will be asked to complete a series of tasks:

1. A short tutorial using the menu.
2. Selections using the menu.
3. A task to measure your creativity.
4. A questionnaire about your experience.

You will repeat this process for 3 different menus. Each menu should take approximately 8 minutes, with the entire experiment taking less than 30 minutes.

We ask that you please maximise the experiment and perform the task in a quiet room without any music or distractions.`,
    },
    // {
    //   task: "FormTask",
    //   label: "demographics",
    //   schema: {
    //     type: "object",
    //     properties: {
    //       age: {
    //         type: "integer",
    //       },
    //       gender: {
    //         type: "string",
    //         enum: [
    //           "woman",
    //           "man",
    //           "non-binary",
    //           "prefer not to disclose",
    //           "prefer to self-describe",
    //         ],
    //       },
    //       selfDescribe: {
    //         type: "string",
    //       },
    //     },
    //     required: ["age", "gender"],
    //   },
    //   uischema: {
    //     type: "VerticalLayout",
    //     elements: [
    //       {
    //         type: "Control",
    //         label: "Age",
    //         scope: "#/properties/age",
    //       },

    //       {
    //         type: "Control",
    //         label: "Gender",
    //         scope: "#/properties/gender",
    //       },
    //       {
    //         type: "Control",
    //         label: "Gender",
    //         scope: "#/properties/selfDescribe",
    //         rule: {
    //           effect: "SHOW",
    //           condition: {
    //             scope: "#/properties/gender",
    //             schema: {
    //               const: "prefer to self-describe",
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
    beginScreen,
    {
      task: "DivergentTest",
      question: `Write down all of the original and creative
      uses for a ${objects[0]} that you can think of. There are common,
      unoriginal ways to use a ${objects[0]}; for this task, write down all of the
      unusual, creative, and uncommon uses you can think of.`,
      object: objects[0],
      // timeLimit: 60 * 1000 * 0.5,
      timeLimit: 60 * 1000 * 3,
    },
    ...conditions,
    // {
    //   defaultState: true,
    //   task: "FormTask",
    //   label: "problems",
    //   schema: {
    //     type: "object",
    //     properties: {
    //       DidYouEncounterAnyIssues: {
    //         type: "string",
    //       },
    //     },
    //   },
    // },
    {
      task: "S3Upload",
      filename: `${participant_id}.json`,
      experimenter: "blaine@dgp.toronto.edu",
    },
    {
      task: "RedirectTask",
      url: "https://app.prolific.co/submissions/complete?cc=C6S70LIF",
    },
    // {
    //   task: "InformationScreen",
    //   content: `Your data has successfully been uploaded. Thank you for completing our experiment!`,
    //   withContinue: false,
    // },
  ],
};

console.log(configuration);

export default configuration;
