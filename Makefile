TSX_FLAGS=--listEmittedFiles --listFiles
TSX_CMD=npx tsc
BUILD_DIR=./dist

# COLOR ALIASES
RED=\033[31m
GREEN=\033[32m
YELLOW=\033[33m
BLUE=\033[34m
MAGENTA=\033[35m
CYAN=\033[36m
RESET=\033[0m

# Colored output function
define print_in_color
	@printf "$1"
	@printf "$2"
	@printf "\033[0m"
endef

build:
	$(call print_in_color, $(GREEN), MAKE: compiling tsx...\n)
	$(call print_in_color, $(YELLOW), >> CMD: $(TSX_CMD)\n)
	@$(TSX_CMD)

run: build
	$(call print_in_color, $(GREEN), MAKE: BUILD SUCCESS ...\n)
	node $(BUILD_DIR)/main.js

clean:
	$(call print_in_color, $(YELLOW), MAKE: Cleaning ...\n)
	rm -rf ./dist
