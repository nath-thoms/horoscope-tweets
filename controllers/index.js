const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3');
const Twit = require('twit');
const { twitterKeys, personalityConfig } = require('../config');

const pi = new PersonalityInsights({
    username: personalityConfig.username,
    password: personalityConfig.password,
    version_date: '2017-12-12'
})

let T = new Twit(twitterKeys)

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
getTweets('nath_thoms');

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
    let twit_name = req.params.twit_name
    return getTweets(twit_name)
    console.log(twit_name)
        .then(tweets => {
            console.log(tweets)
            //if (tweets.join('').split(' ').length < 1000) return null;
            return getPersonalityInsight(JSON.stringify(tweets))
        })
        .then(personalityInfo => {
            res.send(personalityInfo)
        })
}



module.exports = { getStarSign };