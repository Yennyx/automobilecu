CREATE TABLE IF NOT EXISTS data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  homepage_url TEXT NOT NULL,
  license_note TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'paused')),
  last_success_at TEXT
);

CREATE TABLE IF NOT EXISTS market_observations (
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  period TEXT NOT NULL,
  region_code TEXT NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('dump', 'mixer', 'bus_large', 'bus_medium', 'truck_cargo', 'truck_tractor', 'truck_special')),
  metric TEXT NOT NULL CHECK (metric IN ('registration', 'sales', 'inventory')),
  value INTEGER NOT NULL CHECK (value >= 0),
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  published_at TEXT,
  ingested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (source_id, period, region_code, segment, metric)
);

CREATE INDEX IF NOT EXISTS market_observations_lookup
ON market_observations (metric, segment, period, region_code);

CREATE TABLE IF NOT EXISTS research_documents (
  id TEXT PRIMARY KEY,
  publisher TEXT NOT NULL,
  author TEXT,
  title TEXT NOT NULL,
  canonical_url TEXT NOT NULL UNIQUE,
  doi TEXT,
  abstract TEXT,
  summary_ko TEXT,
  summary_model TEXT,
  summary_status TEXT NOT NULL DEFAULT 'editorial' CHECK (summary_status IN ('editorial', 'ai_unreviewed', 'ai_reviewed')),
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  published_at TEXT,
  reviewed_at TEXT,
  source_license TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_ecu_specs (
  id TEXT PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  model_year INTEGER,
  powertrain TEXT NOT NULL,
  ecu_supplier TEXT,
  ecu_part_number TEXT,
  firmware_version TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verified_at TEXT,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('unverified', 'verified', 'retracted'))
);
