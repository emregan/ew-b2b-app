NODE_BIN=./node_modules/.bin
_gulp=${NODE_BIN}/gulp
_concurrently=${NODE_BIN}/concurrently
_forever=${NODE_BIN}/forever
_nodemon=${NODE_BIN}/nodemon
_ts=${NODE_BIN}/tsc
_tslint=${NODE_BIN}/tslint
_webpack=${NODE_BIN}/webpack
_rebuild-node-sass=${NODE_BIN}/rebuild-node-sass

start: install build serve
dev: install watch

install-dev: install install-git-hook;
install: install-npm;

serve:
	$(_forever) ./dist/server.js

install-git-hook:
	# ------------------------------- #
	# Install git hooks
	# ------------------------------- #
	cat git-hooks/pre-commit >> .git/hooks/pre-commit
	cat git-hooks/prepare-commit-msg >> .git/hooks/prepare-commit-msg

install-npm:
	# ------------------------------- #
	# Set production to false to make sure devDepedecies get installed.
	# ------------------------------- #
	@yarn install --production=false

# ---------------------------------------------------- #
# All build related tasks
# ---------------------------------------------------- #
build: build-fe build-server

build-scss:
	# ------------------------------- #
	# Build scss for production
	# ------------------------------- #
	@$(_rebuild-node-sass)
	@$(_gulp) --production --gulpfile ./fe-bundlers/Gulpfile.js

build-webpack:
	# ------------------------------- #
	# Build webpack for production
	# ------------------------------- #
	@$(_webpack) -p --progress --config ./fe-bundlers/webpack.config.js

build-fe: build-scss build-webpack

build-server: tslint build-ts

build-ts:
	# ------------------------------- #
	# Build server-side TypeScript
	# ------------------------------- #
	@$(_ts)

tslint:
	# ------------------------------- #
	# Lint server-side TypeScript
	# ------------------------------- #
	@$(_tslint) -c tslint.json -p tsconfig.json

tslint-fix:
	@$(_tslint) --fix -c tslint.json -p tsconfig.json

# ---------------------------------------------------- #
# All watch related tasks
# ---------------------------------------------------- #
# - Delays nodemon execution by 5 seconds to allow TypeScript to
# 	compile, this prevents nodemon from restarting many times
#
# - Delays gulp watch execution by 8 seconds to allow nodemon to
# 	start, this is done because we're proxying localhost:3000
# 	with browser-sync and that needs to be running first
watch:
	# ------------------------------- #
	# Watch for Gulp, TypeScript
	# and Node changes
	# ------------------------------- #
	@$(_concurrently) -k -p '[{name}]' -n 'TypeScript,Node,BrowserSync,WebPack,Gulp' \
		-c 'blue.bold,green.bold,white.bold,cyan.bold,red.bold' \
		'$(_ts) -w' \
		'sleep 5 && $(_nodemon) --ignore "src/public/*" --ignore "dist/public/*" ./dist/server.js --port=3030' \
		'sleep 8 && node ./fe-bundlers/browser-sync.js'\
		'sleep 8 && $(_webpack) --config ./fe-bundlers/webpack.config.js -w'\
		'sleep 8 && $(_gulp) watch --gulpfile ./fe-bundlers/Gulpfile.js'


docker-build:
	@(echo "Building docker container(s)")
	@(docker-compose -f docker-compose.base.yml -f docker-compose.local.yml -p ewwebdeliveryapp build)

docker-up:
	@(echo "Starting docker container(s)")
	@(docker-compose -f docker-compose.base.yml -f docker-compose.local.yml -p ewwebdeliveryapp up)

docker-down:
	@(echo "Stopping docker container(s)")
	@(docker-compose -f docker-compose.base.yml -f docker-compose.local.yml -p ewwebdeliveryapp down)
