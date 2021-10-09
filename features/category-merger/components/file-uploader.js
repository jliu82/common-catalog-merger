import { useState } from "react";
import styles from "../../../styles/Home.module.css";
import axios from "axios"

function FileUploader({}) {
  const [filesSelelected, setFilesSelected] = useState([]);

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

    const response = await axios.post('/api/category-merger', formData, config);
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
        {filesSelelected.length > 0 ? <button onClick={uploadFiles}>Merge</button> : null}
    </div>
  );
}

export default FileUploader;
