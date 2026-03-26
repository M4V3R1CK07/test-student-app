ALTER TABLE public.flashcards 
ADD COLUMN elapsed_days INTEGER DEFAULT 0,
ADD COLUMN scheduled_days INTEGER DEFAULT 0;
