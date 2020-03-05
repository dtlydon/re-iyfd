import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import iyfdHttp from "../../services/iyfdHttp";
import { Alert, Spinner } from "react-bootstrap";

const AudioHelper: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const onDrop = useCallback(async ([file]) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("track", file);
    formData.append("name", "test");
    await iyfdHttp(
      "post",
      `${process.env.REACT_APP_SERVER_URL}/announcement`,
      formData,
      {
        "Content-Type": "multipart/form-data"
      }
    );
    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".mp3",
    multiple: false
  });
  return (
    <div>
      <h2>Upload MP3</h2>
      {success && <Alert variant="success">MP3 Updated</Alert>}
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {!isLoading && (
        <div className="upload-mp3">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioHelper;
