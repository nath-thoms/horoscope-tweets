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
    let twit_name = req.params.twit_name;
    getTweets(twit_name)
    .then(tweetText => {
        if (tweetText.join('').split(' ').length < 300) return null;
        else return getPersonalityInsight(JSON.stringify(tweetText))
    })
    .then(info => {
        //emotional range
        if (info.personality[4].percentile < 0.2) {
            res.send('aquarius')
        }
        //cautiousness
        else if (info.personality[1].children[1].percentile > 0.75) {
            res.send('pisces')
        }
        //fiery
        else if (info.personality[4].children[0].percentile > 0.85) {
            res.send('aries')
        }
        //openess to change
        else if (info.values[1].percentile < 0.15) {
            res.send('taurus')
        }
        //prone to worry
        else if (info.personality[4].children[1].percentile > 0.90) {
            res.send('gemini')
        }
        //cheerfulness
        else if (info.personality[2].children[2].percentile < 0.30) {
            res.send('cancer')
        }
        //Conscientiousness
        else if (info.personality[1].percentile < 0.10) {
            res.send('leo')
        }
        //outgoing
        else if (info.personality[2].children[4].percentile < 0.30) {
            res.send('virgo')
        }
        //assertiveness
        else if (info.personality[2].children[1].percentile < 0.2) {
            res.send('libra')
        }
        //trust
        else if (info.personality[3].children[5].percentile < 0.33) {
            res.send('scorpio')
        }
        //intellect
        else if (info.personality[0].children[4].percentile < 0.10) {
            res.send('sagitarius')
        }
        //modesty
        else if (info.personality[3].children[2].percentile < 0.10) {
            res.send('capricorn')
        }
        })
        .catch(next)
}

function matchStarSign (){

}




module.exports = { getStarSign };