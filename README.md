# test_starwars

Test project for vacation.

Task described here: https://docs.google.com/document/d/1roF2m313Ky6o5C7Im-tp0k1F_7MuZKpR-KJ7aJcNz-I/edit

# Install

``` bash
git clone https://github.com/pieropatron/test_starwars.git <dest dir>
cd <dest dir>
npm install
npm start
```

After install, please, open following link at your web browser : http://localhost:3000/ to seek data using UI

# API
Additionally, it is possible to request required data using API (Get).

API path: restapi/getList

API method: GET

API query options:
* search: a part of name (case insensitive) to search, string

Example (curl):
``` bash
curl --request GET \
  --url 'http://localhost:3000/restapi/getList?search=corvet'
```

API result is JSON array of elements with following structure:
* type: string - type of element (people, planets, starships)
* name: string - name of element
* tags: Record<string, string> - list of tags (properties) of element:
-- tags of people: "gender", "mass"
-- tags of planets: "diameter", "population"
-- tags of starships: "length", "crew", "passengers"

Example of result:
``` JSON
[
	{
		"name": "CR90 corvette",
		"type": "starships",
		"tags": {
			"length": "150",
			"crew": "30-165",
			"passengers": "600"
		}
	}
]
```
