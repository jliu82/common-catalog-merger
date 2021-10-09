import { flagProductsForMerge, processFiles, generateMergedProducts } from "./catalog-merger";

describe("catalog merger", () => {
  const companies = {
    a: {
      barcodes: [
        { supplierid: "00001", sku: "647-vyk-317", barcode: "z2783613083817" },
        { supplierid: "00001", sku: "647-vyk-317", barcode: "z2783613083817" },
      ],
      suppliers: [
        { id: "00001", name: "Twitterbridge" },
        { id: "00002", name: "Thoughtsphere" },
      ],
      catalog: [
        { sku: "647-vyk-317", description: "Walkers Special Old Whiskey" },
      ],
    },
    b: {
      barcodes: [
        { supplierid: "00001", sku: "947-vyk-317", barcode: "z2783613083817" },
        { supplierid: "00002", sku: "647-vyk-317", barcode: "z2783613083818" },
      ],
      suppliers: [
        { id: "00001", name: "Wikivu" },
        { id: "00002", name: "Divavu" },
      ],
      catalog: [
        {
          sku: "647-vyk-317",
          description: "Another Walkers Special Old Whiskey",
        },
        { sku: "947-vyk-317", description: "Bread - Raisin" },
      ],
    },
  };

  const files = [
    {
      fieldname: "files",
      originalname: "suppliersB.csv",
      buffer: `ID,Name
      00001,Twitterbridge
      00002,Thoughtsphere`,
    },
    {
      fieldname: "files",
      originalname: "suppliersA.csv",
      buffer: "1",
    },
    {
      fieldname: "files",
      originalname: "catalogB.csv",
      buffer: `SKU,Description
      647-vyk-317,Walkers Special Old Whiskey
      280-oad-768,Bread - Raisin`,
    },
    {
      fieldname: "files",
      originalname: "catalogA.csv",
      buffer: `SKU,Description
      647-vyk-317,Walkers Special Old Whiskey
      280-oad-768,Bread - Raisin`,
    },
    {
      fieldname: "files",
      originalname: "barcodesB.csv",
      buffer: "1",
    },
    {
      fieldname: "files",
      originalname: "barcodesA.csv",
      buffer: `SupplierID,SKU,Barcode
      00001,647-vyk-317,z2783613083817
      00001,647-vyk-317,z2783613083818
      00001,647-vyk-317,z2783613083819`,
    },
  ];

  it("should parse csv contents into companies dataset", () => {
    const companies = processFiles(files);
    expect(companies["a"]["catalog"].length).toBe(2);
    expect(companies["a"]["catalog"][0]["sku"]).toEqual("647-vyk-317");
    expect(companies["a"]["barcodes"].length).toBe(3);
    expect(companies["a"]["suppliers"].length).toBe(0);//skipped invalid value "1"

    expect(companies["b"]["barcodes"].length).toBe(0);
    expect(companies["b"]["suppliers"].length).toBe(2);
    expect(companies["b"]["catalog"].length).toBe(2);
  });

  it("should collect products from company B with merge flag", () => {
    const products = flagProductsForMerge(companies);
    expect(products["647-vyk-317"]).toBe(true);
    expect(products["947-vyk-317"]).toBe(false);
  });

  it("should genearate merged product list", () => {
    const products = generateMergedProducts(companies);
    expect(products.length).toBe(2);
    expect(products[0]["sku"]).toEqual("647-vyk-317");
    expect(products[0]["description"]).toEqual("Walkers Special Old Whiskey");
    expect(products[0]["source"]).toEqual("a");
    expect(products[1]["sku"]).toEqual("647-vyk-317");
    expect(products[1]["description"]).toEqual("Another Walkers Special Old Whiskey");
    expect(products[1]["source"]).toEqual("b");
  });
});
