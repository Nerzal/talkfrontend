.PHONY: dev build preview install test test-watch test-ui lint lint-fix format format-check schema clean help

.DEFAULT_GOAL := help

install: ## Install dependencies
	npm install

dev: ## Start dev server (http://localhost:5173)
	npm run dev

build: ## TypeScript check + production build
	npm run build

preview: ## Preview production build locally (build first)
	npm run preview

test: ## Run tests once
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-ui: ## Open Vitest browser UI
	npm run test:ui

lint: ## Check with ESLint
	npm run lint

lint-fix: ## Check with ESLint and auto-fix
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check Prettier formatting
	npm run format:check

schema: ## Regenerate JSON schemas for talk data from src/data/types.ts
	npm run schema

clean: ## Remove build output
	rm -rf dist

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
