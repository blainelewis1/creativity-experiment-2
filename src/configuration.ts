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

const objects = shuffle(["knife", "brick", "shoe"]);
const menus = shuffle([
  "KeyboardShortcutsWithCheatsheet",
  "ToolPalette",
  "MarkingMenu",
]);

// TODO: add shortcuts.
const items = [
  { icon: Undo, label: "Undo", angle: Math.PI, shortcut: "mod+z" },
  { icon: Redo, label: "Redo", angle: 0, shortcut: "mod+y" },
  {
    items: [
      {
        icon: FormatPaint,
        label: "Paint format",
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
    angle: Math.PI / 4,
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

  { icon: Print, label: "Print", shortcut: "mod+p" },
  { icon: Spellcheck, label: "Spellcheck", shortcut: "mod+alt+x" },
  { icon: InsertLink, label: "Insert link", shortcut: "mod+k" },
  { icon: AddComment, label: "Add comment", shortcut: "mod+alt+m" },
  // { icon:  label:"//"}TODO: Checklist, shortcut: "mod+shift+9"},
  { icon: FormatListBulleted, label: "Bulleted list", shortcut: "mod+shift+8" },
  { icon: FormatListNumbered, label: "Numbered list", shortcut: "mod+shift+7" },
  { icon: FormatIndentDecrease, label: "Decrease indent", shortcut: "mod+[" },
  { icon: FormatIndentIncrease, label: "Increase indent", shortcut: "mod+]" },
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
  Math.floor(k * 40)
);

const distributedItems = zip(occurrenceCounts, ranking)
  .map(([count, item]) => times(count ?? 0, () => item ?? ""))
  .flat();

console.log(distributedItems);

const url = new URL(window.location.href);
const participant_id = url.searchParams.get("participant_id");
const conditions = zip(objects, menus).map(([object, menu]) => {
  return {
    menu,
    items,
    children: [
      { task: "Tutorial" },
      {
        menu: menu,
        task: "CommandSelection",
        children: shuffle(distributedItems).map((item) => ({
          command: item,
        })),
      },
      {
        task: "InformationScreen",
        content: `The next screen contains a timed task where you will be given an object and must think of unusual uses for it. Please read the instructions on the page carefully and use the full allotted time to complete the task.`,
      },
      {
        task: "DivergentTest",
        question: `Write down all of the original and creative
        uses for a ${object} that you can think of. There are common,
        unoriginal ways to use a ${object}; for this task, write down all of the
        unusual, creative, and uncommon uses you can think of.`,
        object,
        timeLimit: 60 * 1000 * 0.5,
      },
      {
        task: "Questionnaire",
        questions: [
          "I felt creative while I was selecting commands.",
          "I would like to use that command selection technique while doing a creative task like drawing or writing a story.",
        ],
      },
      { task: "NasaTlx" },
      // { task: "CreativitySupportIndex" },
    ],
  };
});

const configuration = {
  participant_id,
  tasks: ["ProgressBar", "DevTools"],
  children: [
    {
      task: "ConsentForm",

      content: ConsentLetter,
      questions: [
        {
          label: "I understand and consent to the above.",
          required: true,
        },
        {
          label:
            "Yes: Video and audio recordings or frame grabs of the session may be used.",
          required: false,
        },
        {
          label:
            "No: Video and audio recordings or frame grabs of the session may not be used.",
          required: false,
        },
      ],
    },
    {
      task: "InformationScreen",
      content: `
In order to complete this experiment you will first be given a computer menu, and taught how to use it. Following that you will complete a series of questionnaires about your experience. You will do this again with another menu. Please answer the questions about your experience carefully and take your time.`,
    },
    ...conditions,
    {
      task: "S3Upload",
      filename: "blaine_log",
      experimenter: "hello@world.com",
    },
    {
      task: "InformationScreen",
      content: `
Your data has successfully been uploaded. Thank you for completing our experiment!`,
    },
  ],
};

export default configuration;
