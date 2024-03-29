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

var Cassandra = require('oae-util/lib/cassandra');

// Bind the activity listeners
require('oae-following/lib/activity');

module.exports = function(config, callback) {
    _ensureSchema(callback);
};

var _ensureSchema = function(callback) {
    Cassandra.createColumnFamilies({
        'FollowingUsersFollowers': 'CREATE COLUMNFAMILY FollowingUsersFollowers (userId text PRIMARY KEY);',
        'FollowingUsersFollowing': 'CREATE COLUMNFAMILY FollowingUsersFollowing (userId text PRIMARY KEY);'
    }, callback);
};