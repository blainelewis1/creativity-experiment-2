import { promises as fs } from "fs";
import glob from "glob-promise";
import { Parser } from "json2csv";
import { iterateConfiguration, getPropsFor } from "@hcikit/workflow";
// import { filter } from "lodash";

export async function getAllFiles() {
  let fileNames = await glob("data/*.json");
  let files = await Promise.all(
    fileNames.map(async (fileName) =>
      fs.readFile(fileName).then((f) => JSON.parse(f))
    )
  );

  return files;
}

let files = await getAllFiles();
let i = 0;
let tasks = [];
let logs = [];

for (let file of files) {
  // delete file['__INDEX__']
  // TODO: Index is set wrong because it is set to the final index not the current one.
  file.participant_number = i;
  i++;

  for (let task of flattenConfigurationWithProps(file)) {
    tasks.push(task);
  }
}

// filter(logs, { task: "InterpretGraphTask" });

const json2csvParser = new Parser();
const csv = json2csvParser.parse(tasks);
console.log(csv);

function flattenConfigurationWithProps(configuration) {
  return Array.from(iterateConfiguration(configuration)).map((index) => ({
    ...getPropsFor(configuration, index, false),
    __INDEX__: index,
  }));
}
