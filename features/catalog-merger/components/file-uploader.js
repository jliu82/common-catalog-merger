import { useState } from "react";
import styles from "../../../styles/Home.module.css";
import axios from "axios"
import { CSVLink } from "react-csv";

function FileUploader({}) {
  const [filesSelelected, setFilesSelected] = useState([]);
  const [resultData, setResultData] = useState();


  const onFileInputChange = (event) => {
      setFilesSelected(event.target.files)
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    Object.entries(filesSelelected).forEach((file)=>{
        formData.append("files", file[1]);
    });
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    //   onUploadProgress: (event) => {
    //     console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
    //   },
    };

    const response = await axios.post('/api/catalog-merger', formData, config);
    setResultData(response.data.csv)
  };

  return (
    <div>
      <code className={styles.code}>
        <input
          directory=""
          webkitdirectory=""
          type="file"
          onChange={onFileInputChange}
          multiple
        />
      </code>
        <ul>
          {Object.entries(filesSelelected).map((file) => (
            <li key={file[1].name}>{file[1].name}</li>
          ))}
        </ul>
        {filesSelelected.length > 0 ? <button className={styles.actionBtn} onClick={uploadFiles}>Merge</button> : null}
        
        {resultData ?  <p className={styles.description}>Result csv geneated in OUTPUT folder.
                         <CSVLink className={styles.link} data={resultData}>Download</CSVLink>
                       </p>
                    : null}
    </div>
  );
}

export default FileUploader;
