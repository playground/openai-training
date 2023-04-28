OPENAI_KEY ?= ""
INPUT_PROMPTS_FILENAME ?= "dataset/data.jsonl"
OUTPUT_PROMPTS_FILENAME ?= "dataset/mydata.jsonl"

init:
	@cat env-template.json | envsubst > .env-local.json
	@npm install

format:
	@NAME=$(INPUT_PROMPTS_FILENAME) npm run do:format-data

train: format
	@npm run do:upload --name=$(OUTPUT_PROMPTS_FILENAME)

.PHONY: init format train