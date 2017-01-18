# EpitechRanking

Fetches data from epitech's database. Can be used to establish rankings on GPA, Tepitech scores or whatever you fancy.
Every options we send to the API (year, course, promo...) is located in `fetchData.js`

We also compute an experimental `tek4Rank`.
It's based at 50% on your gpa and 15% on your best tepitech. It ranges from 0 to 65

## Usage
paste your PHPSESSID cookie from epitech's intranet 
into `cookie.example.txt` and  rename it to `cookie.txt`

`npm i` or `yarn i` and `npm run start`

All data will be persisted into a `res.json` file that will be accessed in further runs for faster computing. Make sure you delete the `res.json` file if you want to fetch new data.

You can edit those entries and the processing by tweaking `processStudent` in `index.js`

example use : `npm run start > "res.txt"`
