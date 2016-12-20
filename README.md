# EpitechRanking

Fetches data from epitech's database. Can be used to establish rankings on GPA, Tepitech scores or whatever you fancy.
Every options we send to the API (year, course, promo...) is located in `fetchData.js`

## Usage
paste your auth cookie from epitech's intranet 
into `authcookie.example.txt` and  rename it to `authcookie.txt`

`npm i` or `yarn i` and `npm run start`

All data will be persisted into a `res.json` file that will be accessed in further runs for faster computing. Make sure you delete the `res.json` file if you want to fetch new data.

The output is a table showing login, gpa, national gpa rank and national tepitech rank.

You can edit those entries and the processing by tweaking `processStudent` in `index.js`

example use : `npm run start > "res.txt"`
