# Video Game Curator Bot

Posts hourly. Check him out at:
* [Facebook](https://www.facebook.com/Game-Curator-Bot-1178684325584374/)
* [Twitter](https://twitter.com/CuratorGame)
* [Website](https://video-game-curator.herokuapp.com/)

## Information

Starting out as a simple blog for in-game UI, I quickly realised that I couldn't be bothered to update it daily, so decided to automate things a bit.
The project runs on Heroku and includes:

* Scraper (thank you, guys from [MobyGames](http://mobygames.com/)!)
* Automatic posting to Twitter
* Automatic posting to Facebook
* Automatic posting to blog

Once an entry is posted and stored, it can be edited / deleted in the blog at any point later on.
Entries can be uploaded to twitter and facebook from the blog as well.

The project uses Mongo as database, Express as a server and Heroku Cloudinary for image uploading from the blog.
The blog itself uses Passport.js for authentication, Pug for templates and SCSS for styling.

