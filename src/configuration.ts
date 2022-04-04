import { MenuItem } from "@blainelewis1/menus";
import { shuffle, zip } from "lodash";

import {
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Copy,
} from "styled-icons/fa-solid";

import ConsentLetter from "./consent";

const objects = shuffle(["knife", "brick"]);
const menus = shuffle(["ContextMenu", "Toolbar"]);

const items = [
  { icon: Save, label: "Save" },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
  { icon: AlignJustify, label: "Align Justify" },
  { icon: Copy, label: "Copy" },
];

const conditions = zip(objects, menus).map(([object, menu]) => {
  return {
    menu,
    items,
    children: [
      { task: "Tutorial" },
      {
        menu: menu,
        task: "CommandSelection",
        children: shuffle(items).map(({ label }) => ({ command: label })),
      },
      {
        task: "DivergentTest",
        question: `Write down all of the original and creative
        uses for a ${object} that you can think of. There are common,
        unoriginal ways to use a ${object}; for this task, write down all of the
        unusual, creative, and uncommon uses you can think of.`,
        object,
      },
      { task: "CreativitySupportIndex" },
    ],
  };
});

const configuration = {
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
      ],
    },
    {
      task: "InformationScreen",
      content: `
In order to complete this experiment you will first be given a computer menu, and taught how to use it. Following that you will complete a series of questionnaires about your experience. You will do this again with another menu. Please answer the questions about your experience carefully and take your time.`,
    },
    ...conditions,
  ],
};

export default configuration;
