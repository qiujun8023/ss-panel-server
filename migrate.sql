INSERT INTO user (username, nickname, port, password, flow_up
	, flow_down, traffic_limit, is_admin, is_locked, actived_at, created_at
	, updated_at)
SELECT userId, name, port, password, flowUp
	, flowDown, transferEnable
	, if(isAdmin = 'Y', 1, 0)
	, if(isLocked = 'Y', 1, 0)
	, activeAt, registAt, activeAt
FROM ss_user;

INSERT INTO node (id, name, avatar, server, method
	, description, sort, is_visible, actived_at, created_at
	, updated_at)
SELECT nodeId, name, avatar, server, method
	, description, sort
	, if(isVisible = 'Y', 1, 0)
	, activeAt, createdAt, activeAt
FROM ss_node;


INSERT into traffic select ss_transfer.transferId, user.id, ss_transfer.nodeId, ss_transfer.flowUp, ss_transfer.flowDown, ss_transfer.activeAt from ss_transfer
INNER JOIN user
on user.username
= ss_transfer.userId
