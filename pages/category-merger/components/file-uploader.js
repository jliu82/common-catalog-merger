import { useState } from "react";
import styles from "../../../styles/Home.module.css";

function FileUploader({}) {
  const [filesSelelected, setFilesSelected] = useState([]);

  const onFileInputChange = (event) => {
      setFilesSelected(event.target.files)
  };

  const uploadFiles = async()=>{
    const formData = new FormData();
    formData.append("files", filesSelelected);
    await fetch('/api/category-merger', {
        method: 'POST',
        headers: {
        'Content-Type': 'multipart/form-data;'
        },
        body: formData
    })
  }

  return (
    <div>
      <code className={styles.code}>
        <input
          directory=""
          webkitdirectory=""
          type="file"
          onChange={onFileInputChange}
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
