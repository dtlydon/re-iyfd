import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { TournyEntry } from "../../models/interfaces";
import entriesService from "../../services/entriesService";
import { Table, Button, Spinner } from "react-bootstrap";

const Entry: React.FC = () => {
  const [entries, setEntries] = useState<TournyEntry[]>([]);
  const [editId, setEditId] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await entriesService.getAll();
      setEntries(data.entries);
    };
    loadEntries();
  }, []);

  const onChangeEntryEdit = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedEntries = [...entries];
    const entry = updatedEntries.find(e => e._id === editId);
    if (!entry) return;
    entry.team = event.currentTarget.value;
    setEntries(updatedEntries);
  };

  const saveEntryEdit = async () => {
    const entry = entries.find(e => e._id === editId);
    if (!entry) return;
    await entriesService.update(entry);
    setEditId("");
  };

  const onDrop = useCallback(([file]) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: async (results: Papa.ParseResult) => {
        setIsUploading(true);
        try {
          const newEntries = results.data.map(({ Rank, Region, Team }) => {
            return {
              rank: Rank,
              region: Region,
              team: Team
            } as TournyEntry;
          });
          const data = await entriesService.createAll(newEntries);
          setEntries(data.entries);
        } catch (err) {
          console.error(err);
        }
        setIsUploading(false);
      }
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false
  });
  function renderEntries(): any {
    return (
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Region</th>
            <th>Team</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: TournyEntry, index: number) => (
            <tr key={index}>
              <td>{entry.rank}</td>
              <td>{entry.region}</td>
              {entry._id !== editId && <td>{entry.team}</td>}
              {entry._id !== editId && (
                <td>
                  <Button onClick={() => setEditId(entry._id)}>Edit</Button>
                </td>
              )}
              {entry._id === editId && (
                <td>
                  <input
                    type="text"
                    value={entry.team}
                    onChange={onChangeEntryEdit}
                  />
                </td>
              )}
              {entry._id === editId && (
                <td>
                  <Button onClick={saveEntryEdit}>Save</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function renderUpload() {
    return (
      <div className="upload-csv">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h2>Entries</h2>
      {isUploading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {entries.length > 0 ? renderEntries() : renderUpload()}
    </div>
  );
};

export default Entry;
