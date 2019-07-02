import React, {useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import Papa from 'papaparse';
import {TournyEntry} from '../../models/interfaces';
import entryService from '../../services/entryService';

const Entry: React.FC = () => {
	const [entries, setEntries] = useState<TournyEntry[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const onDrop = useCallback(([file]) => {
		Papa.parse(file,{
			header: true,
			complete: (results: Papa.ParseResult) => {
				setEntries(results.data.map(({Rank, Region, Team}) => {
					return {
						rank: Rank,
						region: Region,
						team: Team 
					} as TournyEntry
				}));
			}
		});
	  }, [])
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.csv', multiple: false})
	async function upload(): Promise<void> {
		setIsUploading(true);
		await entryService.createEntries(entries);
		setIsUploading(false);
		setEntries([])
	}
	function renderEntries(): any {
		return (
			<div className="entries">
				{entries.map(entry => (
					<div className="row">
						<div className="col-xs-6">
							<span>{entry.rank}. </span>
							<span>{entry.region} - </span>
							<span>{entry.team}</span>
						</div>
					</div>
				))}
				<button disabled={isUploading} onClick={upload}>Upload</button>
			</div>
		)
	}
	function renderUpload() {
		return (
			<div className="upload-csv">
				<div {...getRootProps()}>
				<input {...getInputProps()} />
				{
					isDragActive ?
					<p>Drop the files here ...</p> :
					<p>Drag 'n' drop some files here, or click to select files</p>
				}
				</div>
			</div>
		)
	}
	return (
		<div>
			<h2>Entries</h2>
			{entries.length > 0 ? renderEntries() : renderUpload()}
		</div>
	)
}

export default Entry;
