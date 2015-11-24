# LibCal feed(s)

Retreive [LibCal][lc] events as JSON objects. I wrote a [Blog Post™][blarg] about how
this works (tldr: it's pulling the same data as LibCal's calendar widgets).

**Note:** this is currently only pulling Calendar events, as a JSON feed of 
library/branch hours already exists. Not too sure how this works with room bookings
either.

## usage

```javascript
var libcalEvents = require('libcal-feed')
var iid = 123
var calendars = [1111, 1212]

libcalEvents(iid, calendars, function (err, events) {
  console.log(events.sort(function (a,b) {
    return a.start > b.start
  }))
})
```

## libcalEvents(iid, calendars, callback)

`callback(err, events)` will be passed an array of events objects. Note that this
won't be sorted, but will be arranged in an order similar to the `calendars` array.

## libcalEvents(opts, callback)

with `opts` being an object with the following options:

key         | value
------------|--------
`iid`       | the institution's LibApps ID
`calendars` | the id(s) of the calendar requested (use an array for multiples)
`start`     | start date for events (either `Date` object or `YYYY-MM-DD` string)
`end`       | end date for events (either `Date` object or `YYYY-MM-DD` string)

## Okay, but what do these events objects look like?

```json
{
  "id": "2202354",
  "title": "Tutoring - Wescoe",
  "start": "2015-12-09T10:15:00",
  "end": "2015-12-09T11:30:00",
  "url": "http://muhlenberg.libcal.com/event/2202354",
  "allDay": false,
  "backgroundColor": "#B3C8EF",
  "borderColor": "#8fa0bf",
  "textColor": "#222",
  "short_desc": "",
  "location": "Seminar C",
  "campus": "",
  "seats": "",
  "pres": "",
  "className": [
    "cat23118"
  ],
  "categories": "Meeting"
}
```

## license

MIT

[lc]: http://springshare.com/libcal/
[blarg]: http://adam.malantonio.com/blog/2015/11/16/get-yr-libcal-feed-as-json.html