
CREATE TABLE memorials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  profile_image_key TEXT,
  is_public BOOLEAN DEFAULT 1,
  qr_code_id TEXT UNIQUE,
  has_paid BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memorials_user_id ON memorials(user_id);
CREATE INDEX idx_memorials_qr_code_id ON memorials(qr_code_id);
CREATE INDEX idx_memorials_is_public ON memorials(is_public);

CREATE TABLE memorial_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memorial_id INTEGER NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memorial_images_memorial_id ON memorial_images(memorial_id);

CREATE TABLE memorial_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memorial_id INTEGER NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memorial_videos_memorial_id ON memorial_videos(memorial_id);

CREATE TABLE memorial_audios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memorial_id INTEGER NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memorial_audios_memorial_id ON memorial_audios(memorial_id);
