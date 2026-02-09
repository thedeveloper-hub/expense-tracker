-- Add order_index column to categories table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'order_index') THEN
        ALTER TABLE categories ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add is_default column to categories table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_default') THEN
        ALTER TABLE categories ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
