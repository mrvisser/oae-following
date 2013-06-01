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
var events = require('events');

var FollowingConstants = require('oae-following/lib/constants').FollowingConstants;
var FollowingDAO = require('./internal/dao');
var PrincipalsConstants = require('oae-principals/lib/constants').PrincipalsConstants;
var PrincipalsDAO = require('oae-principals/lib/internal/dao');
var PrincipalsUtil = require('oae-principals/lib/util');
var TenantUtil = require('oae-tenants/lib/util');

var FollowingAPI = module.exports = new events.EventEmitter();

var getFollowers = module.exports.getFollowers = function(ctx, userId, start, limit, callback) {
    if (!ctx.user() || ctx.user().id !== userId) {
        return callback({'code': 401, 'msg': 'Only the user themself can see their list of followers'});
    }

    FollowingDAO.getFollowers(userId, start, limit, function(err, followerUserIds) {
        if (err) {
            return callback(err);
        }

        PrincipalsUtil.getUsers(ctx, followerUserIds, function(err, users) {
            if (err) {
                return callback(err);
            }

            var followers = [];
            _.each(followerUserIds, function(followerUserId) {
                followers.push(users[followerUserId]);
            });

            return callback(null, followers);
        });
    });
};

var getFollowing = module.exports.getFollowing = function(ctx, userId, start, limit, callback) {
    if (!ctx.user() || ctx.user().id !== userId) {
        return callback({'code': 401, 'msg': 'Only the user themself can see the list of users they follow'});
    }

    FollowingDAO.getFollowing(userId, start, limit, function(err, followingUserIds) {
        if (err) {
            return callback(err);
        }

        PrincipalsUtil.getPrincipals(ctx, followingUserIds, function(err, users) {
            if (err) {
                return callback(err);
            }

            var following = [];
            _.each(followingUserIds, function(followingUserId) {
                following.push(users[followingUserId]);
            });

            return callback(null, following);
        });
    });
};

var follow = module.exports.follow = function(ctx, followedUserId, callback) {
    if (!ctx.user()) {
        return callback({'code': 400, 'msg': 'Only authenticated users can follow other users'});
    }

    PrincipalsDAO.getPrincipal(followedUserId, function(err, followedUser) {
        if (err) {
            return callback(err);
        } else if (followedUser.visibility === PrincipalsConstants.visibility.PRIVATE) {
            return callback({'code': 401, 'msg': 'You are not authorized to follow this user'});
        }

        FollowingDAO.saveFollows(ctx.user().id, [followedUserId], function(err) {
            if (err) {
                return callback(err);
            }

            FollowingAPI.emit(FollowingConstants.events.FOLLOW, ctx, ctx.user(), followedUser);
            return callback();
        });
    });
};

