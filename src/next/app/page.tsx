/* global fetch, alert */
"use client";

import * as React from 'react';
import _ from 'lodash';

export default function Page() {
	const {useState} = React;
	const [ search, setSearch ] = useState("");
	const [ block, setBlock ] = useState(false);
	const [ rows, setRows ] = useState([] as any[]);

	return <div className='row form-group' style={{margin: '25px'}}>
		<div className='row'>
			<h2>Star Wars search by name</h2>
		</div>
		<div className='row form-group' style={{marginBottom: "10px"}}>
			<label className='label col-sm-3'>Name:</label>
			<input type='text' className='col-sm-6' onChange={(e)=>{
				setSearch(e.currentTarget.value);
			}} value={search} disabled={block}/>
			<div className='col-sm-3'>
			<button className='btn btn-primary pull-right' onClick={async ()=>{
				if (!search){
					alert(`Search value should be filled`);
					return;
				}
				setBlock(true);
				setRows([]);
				const response = await fetch("/restapi/getList?" + new URLSearchParams({search}).toString(), {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await response.json();
				setBlock(false);
				setRows(data);
			}} disabled={block} style={{marginLeft: '10px'}}>Search</button>
			</div>
		</div>
		<table className='table table-stripped'>
			<thead>
				<tr>
					<th>Type</th>
					<th>Name</th>
					<th>Tags</th>
				</tr>
			</thead>
			<tbody>
			{_.map(rows, (row, i)=>{
				return (<tr key={i}>
					<td>{row.type}</td>
					<td>{row.name}</td>
					<td>{_.map(row.tags, (value, key)=>{
						return (<div key={i+ "_" +key}>{`${key}: ${value}`}</div>);
					})}</td>
				</tr>);
			})}
			</tbody>
		</table>
	</div>;
}
