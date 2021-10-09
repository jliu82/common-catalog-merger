import multer from "multer";
import {get, set, find, assign, forEach} from "lodash"

const upload = multer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.array("files", 6)(req, {}, (err) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      generateMergedProducts(processFiles(req.files));
    });
    res.status(200).send({});
  } else {
    res.status(200).json({ status: "it is running" });
  }
}

export const processFiles = (files) => {
  const companies = {};
  files.forEach((file) => {
    //generate path by checking substr of filename (eg catalog*.csv) is A or B, and followed by entity type
    set(companies, 
        `${file.originalname.substr(-5, 1).toLowerCase()}.${file.originalname.substr(0,file.originalname.length - 5).toLowerCase()}`,
        parseCsvContent(file.buffer.toString()))
  });
  return companies;
};

export const parseCsvContent = (data) => {
  // Split into header and rows
  const [headerRow, ...rows] = data.split("\n");
  // Split header/rows with comma seperator into array of values
  const parseRow = (row) => row.replace("\r", "").split(",");
  const headers = parseRow(headerRow);

  // Create categories from rows
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

export const flagProductsForMerge = (companies)=>{
    //check each product and flag if it needs to be merged
    return get(companies, "b.barcodes").reduce((items, barcodeData)=>{
        const sku = get(barcodeData, "sku");
        const barcode = get(barcodeData, "barcode")
         //skip items marked as merge=false which means it has already been found from a's barcodes
        if(get(items, sku) !== false){
            set(items, sku, !find(get(companies, "a.barcodes"),(aBarcode)=>aBarcode.barcode === barcode));
        }
        return items;
    }, {})
}

export const generateMergedProducts = (companies)=>{
    //collect all the catelog items from a first
    const allProducts = get(companies, "a.catalog").map(catelog => 
        {return assign(catelog, {"source" : "a"})}
    )
    
    const itemsToMerge = flagProductsForMerge(companies)
    //add catelog items from B which has been marked as to be merged
    forEach(itemsToMerge, (value, key)=>{
        if(value === true)
            allProducts.push({"sku":key, "source":"b", "description": findDescriptionBySku(companies.b, key)})
    })

    return allProducts;
}

const findDescriptionBySku = (company, sku) =>{
    return find(get(company, "catalog"),(catelog) => 
        catelog.sku === sku
    )
}