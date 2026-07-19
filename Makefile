.PHONY: dev build preview install test test-watch test-ui clean help

.DEFAULT_GOAL := help

install: ## Abhängigkeiten installieren
	npm install

dev: ## Dev-Server starten (http://localhost:5173)
	npm run dev

build: ## TypeScript-Check + Production Build
	npm run build

preview: ## Production Build lokal vorschauen (build vorher nötig)
	npm run preview

test: ## Tests einmalig ausführen
	npm run test

test-watch: ## Tests im Watch-Modus ausführen
	npm run test:watch

test-ui: ## Vitest Browser-UI öffnen
	npm run test:ui

clean: ## Build-Output löschen
	rm -rf dist

help: ## Verfügbare Targets anzeigen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
