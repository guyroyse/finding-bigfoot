# Finding Bigfoot with Redis + RediSearch

Bigfoot has been a staple of American folklore since the 19th century. Many are convinced that Bigfoot is real. Others suggest he’s merely a cultural phenomenon. And some just want to believe. There is even a group, the [Bigfoot Field Researchers Organization](http://bfro.net/), that tracks Bigfoot sightings and makes the reports available online. And they have thousands of reports.

I want to explore this delightful data but, unfortunately, it’s been made for the convenience of humans and not computers. While this makes it easy for me to read, searching for reports can be a bit of a challenge. Some of the data is tidy and computer friendly—like the latitude and longitude. Other bits are really for us humans—like the eyewitness accounts. So, how can I find the Bigfoot sightings that interest me most with data structured like this?

Well, I’ll show you! In this talk, I’ll load these Bigfoot sightings into Redis and use RediSearch to index them, making it easy to query both the computer friendly bits and the human friendly bits. I’ll also show you how to search on fields, find keywords within text, find nearby Bigfoot sightings using geolocation data, and run queries that aggregate these searches.

When we’re done, you’ll know how to quickly search, query, and aggregate data in Redis using RediSearch. You can use this newfound power for boring old corporate data, but I’m going to use it to find Bigfoot!
