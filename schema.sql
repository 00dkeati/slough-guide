-- Slough Directory Database Schema

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Areas table
CREATE TABLE areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Businesses table
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  area TEXT NOT NULL,
  postcode TEXT,
  address TEXT,
  lat REAL,
  lng REAL,
  phone TEXT,
  website TEXT,
  description TEXT,
  opening_hours_json TEXT, -- JSON string
  rating REAL DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(slug),
  FOREIGN KEY (area) REFERENCES areas(slug)
);

-- Events table (for future use)
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date DATETIME,
  venue TEXT,
  area TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area) REFERENCES areas(slug)
);

-- Indexes for better performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_area ON businesses(area);
CREATE INDEX idx_businesses_category_area ON businesses(category, area);
CREATE INDEX idx_businesses_featured ON businesses(featured);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);

-- Insert sample categories
INSERT INTO categories (id, name, slug, description) VALUES
('cat-1', 'Plumbers', 'plumbers', 'Professional plumbing services in Slough and surrounding areas'),
('cat-2', 'Cafes', 'cafes', 'Local cafes and coffee shops in Slough'),
('cat-3', 'Veterinarians', 'vets', 'Veterinary services and animal care'),
('cat-4', 'Restaurants', 'restaurants', 'Local restaurants and dining options'),
('cat-5', 'Hair Salons', 'hair-salons', 'Hair styling and beauty services');

-- Insert sample areas
INSERT INTO areas (id, name, slug, description) VALUES
('area-1', 'Slough', 'slough', 'Main town center of Slough'),
('area-2', 'Cowplain', 'cowplain', 'Residential area of Cowplain'),
('area-3', 'Denmead', 'denmead', 'Village area of Denmead'),
('area-4', 'Purbrook', 'purbrook', 'Residential area of Purbrook'),
('area-5', 'Horndean', 'horndean', 'Village area of Horndean');

