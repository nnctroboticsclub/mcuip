DEVICE := /dev/ttyUSB0


DOCKER_IMAGE := mcuip-esp32-agent
DOCKER := docker run -it --rm \
	-v $(PWD):/project -w /project \
	-u $(shell id -u):$(shell id -g) \
	--device=$(DEVICE):/tmp/device \
	-e HOME=/tmp \
	-e ESPPORT=/tmp/device \
	$(DOCKER_IMAGE)

.docker/builded: $(filter-out .docker/builded,$(wildcard .docker/*))
	docker build -t $(DOCKER_IMAGE) .docker
	touch $@

.PHONY: build
build: .docker/builded
	@$(DOCKER) idf.py build

.PHONY: flash
flash: .docker/builded
	$(DOCKER) idf.py flash

.PHONY: monitor
monitor: .docker/builded
	$(DOCKER) idf.py monitor

.PHONY: shell
shell: .docker/builded
	$(DOCKER) bash