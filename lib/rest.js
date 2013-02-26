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

var FollowingAPI = require('oae-following');
var OAE = require('oae-util');

OAE.tenantServer.get('/api/following/:userId/followers', function(req, res) {
    req.telemetryUrl = '/api/following/userId/followers';

    var ctx = req.ctx;
    var userId = req.params.userId;
    FollowingAPI.getFollowers(ctx, userId, req.query.start, req.query.limit, function(err, followers) {
        if (err) {
            return res.send(err.code, err.message);
        }

        return res.send(200, followers);
    });
});


OAE.tenantServer.post('/api/following/:userId/follow', function(req, res) {
    req.telemetryUrl = '/api/following/userId/follow';

    var ctx = req.ctx;
    var userId = req.params.userId;
    FollowingAPI.follow(ctx, userId, function(err, followers) {
        if (err) {
            return res.send(err.code, err.message);
        }

        return res.send(200);
    });
});


OAE.tenantServer.get('/api/following/:userId/following', function(req, res) {
    req.telemetryUrl = '/api/following/userId/following';

    var ctx = req.ctx;
    var userId = req.params.userId;
    FollowingAPI.getFollowing(ctx, userId, req.query.start, req.query.limit, function(err, following) {
        if (err) {
            return res.send(err.code, err.message);
        }

        return res.send(200, following);
    });
});