import axios from "axios";
import dotenv from "dotenv";
import * as mysql from "mysql2";
import "dotenv/config";

dotenv.config({ path: "../.env" });

// Set up connection pool for database
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "news_report_db",
  port: 3306,
});

// Set up youtube API key
const apiKey = process.env.YOUTUBE_API_KEY;

// Query function
function sqlquery(...parameters) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
      }

      if (parameters.length === 1) {
        conn.query(parameters[0], function (error, results) {
          if (error) {
            reject(error);
          } else {
            conn.destroy();
            resolve(results);
          }
        });
      } else {
        conn.query(parameters[0], parameters[1], function (error, results) {
          if (error) {
            reject(error);
          } else {
            conn.destroy();
            resolve(results);
          }
        });
      }
    });
  });
}

// Searching Youtube function
async function searchYouTubeVideos(query, mode) {
  try {
    // Seting modes for searching
    let order = "relevance";
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
    let datePublishedAfter = currentDate.toISOString();
    if (mode == "advanced") {
      order = "viewCount";
      currentDate.setDate(currentDate.getDate() - 2);
      datePublishedAfter = currentDate.toISOString();
    } else if (mode == "automatic") {
      order = "relevance";
      currentDate.setDate(currentDate.getDate() - 12);
      datePublishedAfter = currentDate.toISOString();
    }
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          key: apiKey,
          publishedAfter: datePublishedAfter,
          order: order,
          type: "video",
          maxResults: 25,
        },
      }
    );

    const videos = response.data.items;
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

// Fucntion that check if the channel id is included in the origin list
function checkChannelId(video, originList) {
  for (let i = 0; i <= originList.length - 1; i++) {
    if (originList[i].url.includes(video.snippet.channelId)) return true;
  }
  return false;
}

// Function to handle node leads to multiple branch
async function routers(booleanFunction, func1, func2) {
  let results;
  if (await booleanFunction()) results = await func1();
  else results = await func2();
  return results;
}

// -------------------------- MAIN FUNCTION -------------------------- //

async function youtubeGatherData() {
  const response = await routers(
    // Checking if there are any data to use
    async function amountDataCheck() {
      const data = await sqlquery(
        `SELECT SUM(total_count) FROM (
          SELECT COUNT(*) AS total_count FROM topics
          UNION ALL
          SELECT COUNT(*) AS total_count FROM origin
          UNION ALL
          SELECT COUNT(*) AS total_count FROM history
        ) AS counts;`
      );
      if (data[0]["SUM(total_count)"] == 0) return false;
      else return true;
    },
    // Start sequence if there are any data
    async () => {
      // Get the list of topics in descending orders
      let topTopics = await sqlquery(
        "SELECT * FROM topics ORDER BY point DESC"
      );
      // Filter the list if there are 4+ entries then get the top 3
      if (topTopics.length > 3) topTopics = topTopics.splice(0, 3);
      let filteredList = [];
      // Search through each topic
      for (let i = 0; i <= topTopics.length - 1; i++) {
        // Get the top origins
        let topOrigin = await sqlquery(
          `SELECT origin.url FROM origin
          INNER JOIN origin_and_topics ON origin.origin_id = origin_and_topics.origin_id
          WHERE origin_and_topics.topic_id = ? AND url LIKE "https://www.youtube.com%"
          ORDER BY point DESC`,
          [topTopics[i].topic_id]
        );
        // Perform search
        let searchResult = await searchYouTubeVideos(
          topTopics[i].query,
          "default"
        );
        // Filter the list according to the origin list
        for (let j = 0; j <= searchResult.length - 1; j++) {
          if (checkChannelId(searchResult[j], topOrigin))
            filteredList.push(searchResult[j]);
        }
      }
      console.log(filteredList);
    },
    // Return empty array if there are no data
    async function endSequence() {
      return [];
    }
  );

  console.log(response);
}

youtubeGatherData();
