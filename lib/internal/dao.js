/*!
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');
var Cassandra = require('oae-util/lib/cassandra');
var OaeUtil = require('oae-util/lib/util');

var getFollowers = module.exports.getFollowers = function(userId, start, limit, callback) {
    var paging = Cassandra.getPagingParameters(start, limit, '0');
    Cassandra.runQuery('SELECT FIRST ' + paging.limit + ' ? .. \'\' FROM FollowingUsersFollowers USING CONSISTENCY QUORUM WHERE userId = ?', [paging.start, userId], function(err, rows) {
        if (err) {
            return callback(err);
        }

        var followers = [];
        var row = rows[0];
        row.forEach(function(name) {
            followers.push(name);
        });

        return callback(null, followers);
    });
};

var getFollowing = module.exports.getFollowing = function(userId, start, limit, callback) {
    var paging = Cassandra.getPagingParameters(start, limit, '0');
    Cassandra.runQuery('SELECT FIRST ' + paging.limit + ' ?..\'\' FROM FollowingUsersFollowing USING CONSISTENCY QUORUM WHERE userId = ?', [paging.start, userId], function(err, rows) {
        if (err)  {
            return callback(err);
        }

        var following = [];
        var row = rows[0];
        row.forEach(function(name) {
            following.push(name);
        });

        return callback(null, following);
    });
};

var saveFollows = module.exports.saveFollows = function(followerUserId, followedUserIds, callback) {
    followedUserIds = followedUserIds || [];
    followedUserIds = _.compact(followedUserIds);
    if (!followedUserIds.length) {
        return callback();
    }

    var queries = [];
    _.each(followedUserIds, function(followedUserId) {
        queries.push({
            'query': 'UPDATE FollowingUsersFollowing SET ? = \'1\' WHERE userId = ?',
            'parameters': [followedUserId, followerUserId]
        },
        {
            'query': 'UPDATE FollowingUsersFollowers SET ? = \'1\' WHERE userId = ?',
            'parameters': [followerUserId, followedUserId]
        });
    });

    Cassandra.runBatchQuery(queries, 'QUORUM', callback);
};

