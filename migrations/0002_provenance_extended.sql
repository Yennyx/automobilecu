-- D1 uses SQLite. Related metrics are normalized instead of hiding them in JSONB.

CREATE TABLE IF NOT EXISTS extended_observations (
  id TEXT PRIMARY KEY,
  metric TEXT NOT NULL CHECK (metric IN (
    'ev_charger_count', 'hydrogen_station_count', 'scrappage_count',
    'subsidy_amount', 'semiconductor_index', 'rare_earth_index',
    'bus_replacement_cycle'
  )),
  period TEXT NOT NULL,
  region_code TEXT NOT NULL,
  vehicle_type TEXT,
  fuel_type TEXT,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  denominator TEXT,
  applicability_note TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL CHECK (source_url LIKE 'https://%'),
  published_at TEXT,
  recorded_at TEXT NOT NULL,
  ingested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  quality_status TEXT NOT NULL CHECK (quality_status IN ('raw', 'reviewed', 'rejected')),
  UNIQUE(metric, period, region_code, vehicle_type, fuel_type, source_url)
);

CREATE INDEX IF NOT EXISTS extended_observations_lookup
ON extended_observations (metric, period, region_code, quality_status);

CREATE TABLE IF NOT EXISTS recall_notices (
  id TEXT PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  production_start TEXT,
  production_end TEXT,
  component_name TEXT,
  ecu_part_number TEXT,
  description TEXT NOT NULL,
  recall_start_date TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL CHECK (source_url LIKE 'https://%'),
  recorded_at TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('unverified', 'verified', 'retracted'))
);

CREATE INDEX IF NOT EXISTS recall_match_idx
ON recall_notices (manufacturer, model, ecu_part_number, verification_status);

CREATE TABLE IF NOT EXISTS granbird_observations (
  period TEXT NOT NULL,
  region_code TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  registration_count INTEGER CHECK (registration_count >= 0),
  station_coverage_pct REAL CHECK (station_coverage_pct BETWEEN 0 AND 100),
  replacement_cycle_years REAL CHECK (replacement_cycle_years > 0),
  station_denominator TEXT,
  registration_source_url TEXT NOT NULL CHECK (registration_source_url LIKE 'https://%'),
  station_source_url TEXT,
  cycle_source_url TEXT,
  reviewed_at TEXT NOT NULL,
  PRIMARY KEY(period, region_code, fuel_type)
);
