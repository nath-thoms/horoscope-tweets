const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3');
const Twit = require('twit');
//const { twitterKeys, personalityConfig } = require('../config');
const username = process.env.username || require('../config').personalityConfig.username;
const password = process.env.password || require('../config').personalityConfig.password;
const url = process.env.url || require('../config').personalityConfig.url;
const consumer_key = process.env.consumer_key || require('../config').twitterKeys.consumer_key;
const consumer_secret = process.env.consumer_secret || require('../config').twitterKeys.consumer_secret;
const access_token = process.env.access_token || require('../config').twitterKeys.access_token;
const access_token_secret = process.env.access_token_secret || require('../config').twitterKeys.access_token_secret;

const fs = require('fs')

const pi = new PersonalityInsights({
    username: username,
    password: password,
    version_date: '2017-12-12'
})

let T = new Twit({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token: access_token,
    access_token_secret: access_token_secret
})

function getTweets(handle) {
    return T.get("statuses/user_timeline", {
        screen_name: handle,
        count: 30
    })
        .then(tweets => {
            for (let key in tweets) {
                if (key === "data") {
                    tweetText = (tweets[key].map(tweet => tweet.text))
                    return tweetText;
                }
            }
        })
}

// getTweets('nath_thoms');

function getPersonalityInsight(content) {
    return new Promise((resolve, reject) => {
        pi.profile(
            {
                content,
                content_type: "text/plain"
            },
            (err, insight) => {
                if (err) reject(err)
                //console.log(insight.personality[1].children)
                return resolve(insight)
            }
        )
    })
}


function getStarSign(req, res, next) {
    let twit_name = req.query.handle
    getTweets(twit_name)
        .then(tweetText => {
            if (tweetText.join('').split(' ').length < 300) return null;
            else return getPersonalityInsight(JSON.stringify(tweetText))
        })
        .then(info => {
            //emotional range aquarius
            if (info.personality[4].percentile < 0.2) {
                return matchStarSign(0, res)
            }
            //cautiousness pisces
            else if (info.personality[1].children[1].percentile > 0.75) {
                return matchStarSign(1, res)
            }
            //fiery aries
            else if (info.personality[4].children[0].percentile > 0.85) {
                return matchStarSign(2, res)
            }
            //openess to change taurus
            else if (info.values[1].percentile < 0.15) {
                return matchStarSign(3, res)
            }
            //prone to worry gemini
            else if (info.personality[4].children[1].percentile > 0.90) {
                return matchStarSign(4, res)
            }
            //cheerfulness cancer
            else if (info.personality[2].children[2].percentile < 0.30) {
                return matchStarSign(5, res)
            }
            //Conscientiousness leo
            else if (info.personality[1].percentile < 0.10) {
                return matchStarSign(6, res)
            }
            //assertiveness libra
            else if (info.personality[2].children[1].percentile < 0.25) {
                return matchStarSign(7, res)
            }
            //outgoing virgo
            else if (info.personality[2].children[4].percentile < 0.30) {
                return matchStarSign(8, res)
            }
            //trust scorpio
            else if (info.personality[3].children[5].percentile < 0.33) {
                return matchStarSign(9, res)
            }
            //intellect sagitarius
            else if (info.personality[0].children[4].percentile < 0.10) {
                return matchStarSign(10, res)
            }
            //modesty capricorn
            else if (info.personality[3].children[2].percentile < 0.10) {
                return matchStarSign(11, res)
            }
        })
        .catch(next)
}

function matchStarSign(starSign, res) {
    fs.readFile(`${process.cwd()}/db/data.json`, "utf-8", (err, data) => {
        if (err) {
            console.log({ error: err + 'in get Star Sign function' })
        } else {
            data = JSON.parse(data)
            res.render('pages/horoscope', { horoscope: data[starSign] })
        }
    })
}




module.exports = { getStarSign };