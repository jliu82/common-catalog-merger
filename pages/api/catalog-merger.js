import multer from "multer";
import {get, set, find, assign, forEach} from "lodash"
import {parseCsvContent, writeCsvToOutputFolder} from "../../features/catalog-merger/services/csv-processor"

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
      const mergedProducts = generateMergedProducts(processFiles(req.files));
      res.status(200).send({csv: mergedProducts})
      //won't be able to write to OUTPUT folder per requirement if deployed on server, 
      //write csv after the 200 resonse so it can be used in both senarios.
      writeCsvToOutputFolder(mergedProducts)
    });
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

//Merge 2 catalogs together, we can just collect unique items from A, and merge in items from B which can't not be found by barcode matching
export const generateMergedProducts = (companies)=>{
    //collect all the catalog items from A first
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
    return get(find(get(company, "catalog"),(catelog) => 
        catelog.sku === sku
    ), "description")
}