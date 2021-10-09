import {parseCsvContent} from "./csv-processor"

describe("csv processor", () => {
  const sampleContent =  `SKU,Description
      647-vyk-317,Walkers Special Old Whiskey
      280-oad-768,Bread - Raisin`;

  const contentWithEndingNewLineCharactor =  `SKU,Description
      647-vyk-317,Walkers Special Old Whiskey
      280-oad-768,Bread - Raisin
      `;

  it("should parse csv", () => {
    const items = parseCsvContent(sampleContent);
    expect(items.length).toBe(2);
    expect(items[0]["sku"]).toEqual("647-vyk-317");
    expect(items[1]["description"]).toEqual("Bread - Raisin");
  });

  it("should skip empty rows", () => {
    const items = parseCsvContent(contentWithEndingNewLineCharactor);
    expect(items.length).toBe(2);
    expect(items[0]["sku"]).toEqual("647-vyk-317");
    expect(items[1]["description"]).toEqual("Bread - Raisin");
  });
});
