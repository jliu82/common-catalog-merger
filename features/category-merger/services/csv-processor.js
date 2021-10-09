const createCsvWriter = require("csv-writer").createObjectCsvWriter;
export const OUTPUT_FILE_PATH = "./output/result_output.csv"
const csvWriter = createCsvWriter({
  path: OUTPUT_FILE_PATH,
  header: [
    { id: "sku", title: "SKU" },
    { id: "description", title: "Description" },
    { id: "source", title: "Source" },
  ],
});

const records = [
  { name: "Bob", lang: "French, English" },
  { name: "Mary", lang: "English" },
];

export const writeCsvToOutputFolder = async(data) => {
    return csvWriter.writeRecords(data)
}

export const parseCsvContent = (data) => {
  // Split into header and rows
  const [headerRow, ...rows] = data.trim().split("\n");
  // Split header/rows with comma seperator into array of values
  const parseRow = (row) => row.replace("\r", "").split(",");
  const headers = parseRow(headerRow);

  return rows.map((row) =>
    parseRow(row)
      // Reduce values array into an object like: { [header]: value }
      .reduce(
        (object, value, index) => ({
          ...object,
          [headers[index].toLowerCase()]: value.trim(),
        }),
        {}
      )
  );
};
