import express from 'express';
import http from 'http';
import axios, {AxiosError} from 'axios';
import _ from 'lodash';
import {Logger} from '@pieropatron/tinylogger';

const logger = new Logger(`test_starwars`);

type ResponseRow = {
	name: string,
	type: string,
	tags: Record<string, string>
};

const TYPES = {
	people: ["gender", "mass"],
	planets: ["diameter", "population"],
	starships: ["length", "crew", "passengers"]
};

const get = async (type: string, url: string, result: ResponseRow[])=>{
	const response = await axios<{count: number, next?: string, previous: null, results: any[]}>(url, {
		method: "get",
		params: {},
		data: {},
		responseType: 'json',
		timeout: 60000
	});

	const data = response.data;
	_.each(data.results, row=>{
		result.push({
			name: row.name,
			type,
			tags: _.reduce(TYPES[type], (memo, key)=>{
				const value: string = row[key] || "";
				if (value){
					memo[key] = value;
				}
				return memo;
			}, {})
		});
	});

	if (data.next && _.size(data.results)){
		return get(type, data.next, result);
	}
};

const get_list = async (type: string, results: any[], search?: string)=>{
	const url = search ? `https://swapi.dev/api/${type}?search=${search}` : `https://swapi.dev/api/${type}`;
	await get(type, url, results);
	return results;
};

const start = async ()=>{
	const restapi = express();
	restapi.use(express.json());

	restapi.get("/getList", async (req, res)=>{
		const query: {search?: string} = req.query;
		const results: ResponseRow[] = [];
		const search = query.search || "";
		if (typeof(search) !== 'string'){
			res.status(422).json({
				status: 422,
				message: `Invalid search`
			});
		}

		for (const type in TYPES){
			await get_list(type, results, search);
		}

		res.json(results);
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	restapi.use((error, req, res, next)=>{
		if (!error){
			return;
		}

		if (error instanceof AxiosError) {
			res.status(error.code).json({
				status: error.message,
				message: error.message
			});
		} else {
			logger.fatal(error);
			process.exit(1);
		}
	});

	http.createServer(restapi).listen(3000);
};

const time = logger.time('init', 'info');
start().then(()=>{
	time();
}, error=>{
	time();
	logger.fatal(error);
	process.exit(1);
});
