ifeq ($(APP),)
$(error APP is not set. please set it to the path of your ESP32 project)
endif
ifeq ($(EMU_ROOT),)
$(error EMU_ROOT is not set. please set it to the path of emulation directory root)
endif

# ----------------------------------------------
# Variables
# ----------------------------------------------

# Path ALias
ESP32_BUILD_DIR=$(APP)/build
_:=$(shell echo $(ESP32_BUILD_DIR))
_:=$(shell ls $(ESP32_BUILD_DIR))

# File setting
FLASH_BIN:=$(EMU_ROOT)/bin/flash.bin
APP_BIN:=$(EMU_ROOT)/bin/app.bin
EFUSE_BIN:=$(EMU_ROOT)/bin/efuse.bin

.PHONY: all
all: $(FLASH_BIN) $(EFUSE_BIN)

$(FLASH_BIN): $(APP_BIN)
	@printf "\033[32m[Make|INFO]\033[1;33m Creating flash image [$@]...\033[m\n"
	@printf "\033[2;32m[Make|INFO]\033[33m Due to $?\033[m\n"

	@dd if=/dev/zero of=$@ bs=1M count=16 conv=notrunc 2> /dev/null

	@printf "\033[32m[Make|INFO]\033[33m Spraying from [$(APP_BIN)]...\033[m\n"
	@dd if=$(APP_BIN) of=$@ conv=notrunc 2> /dev/null

$(EFUSE_BIN):
	@printf "\033[32m[Make|INFO]\033[1;33m Creating efuse image [$@]...\033[m\n"
	@printf "\033[2;32m[Make|INFO]\033[33m Due to $?\033[m\n"

	@dd if=/dev/zero of=$@ bs=4 count=31 conv=notrunc 2> /dev/null

$(APP_BIN): \
		$(wildcard $(ESP32_BUILD_DIR)/*.bin) \
		$(ESP32_BUILD_DIR)/bootloader/bootloader.bin \
		$(ESP32_BUILD_DIR)/partition_table/partition-table.bin

	@printf "\033[32m[Make|INFO]\033[1;33m Creating app image [$@]...\033[m\n"
	@printf "\033[2;32m[Make|INFO]\033[33m Due to $?\033[m\n"
	@cd $(ESP32_BUILD_DIR); \
	python3 -m esptool \
	  --chip esp32 \
		merge_bin \
		--fill-flash-size 4MB \
		-o flash.bin \
		@flash_args | sed -Ee 's/^(.*)$$/\o33[2;35m[esptool]\o33[m > \o33[33m\1\o33[m/'
	@mv $(ESP32_BUILD_DIR)/flash.bin $@

.PHONY: esp-burn-efuse
esp-burn-efuse: $(DOCKER_BUILDED)
	@$(ESPEFUSE) --virt --path-efuse-file $(EFUSE_BIN) burn_efuse CHIP_VER_REV1
	@$(ESPEFUSE) --virt --path-efuse-file $(EFUSE_BIN) burn_efuse CHIP_VER_REV2