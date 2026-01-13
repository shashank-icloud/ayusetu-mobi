# Ayusetu Backend (Service Layer)

This folder contains backend/service-layer logic for **ABHA & Digital ID (Category 1)** and **PHR Core (Category 2)**.

Today, Ayusetu is a **React Native-only** app running in **Developer Mode** by default (`src/config/env.ts`).

## What this backend folder is

- A clean separation for *all ABDM/network/data logic*.
- Designed so it can evolve into:
  - **(A)** an in-app service layer (current use), and/or
  - **(B)** a real server (Node/Express/Nest) later.

## Folder layout

- `backend/http/` – shared HTTP client utilities (axios instances, interceptors)
- `backend/abdm/` – ABDM gateway APIs for ABHA flows (Category 1)
- `backend/phr/` – PHR core APIs & domain logic (Category 2)
- `backend/types/` – shared domain types

## Current integration strategy

The React Native app should import service entrypoints from:

- `backend/abdm/abdmService`
- `backend/phr/phrService`

The old files under `src/services/` become thin re-exports (or can be removed later).
