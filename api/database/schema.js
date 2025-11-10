import { pgTable, uuid, varchar, text, date, boolean, timestamp, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela: users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela: experiences (experiência profissional)
export const experiences = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  startDate: date('start_date', { mode: 'date' }).notNull(),
  endDate: date('end_date', { mode: 'date' }),
  isCurrent: boolean('is_current').default(false).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela: educations (formação acadêmica)
export const educations = pgTable('educations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  degree: varchar('degree', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  startDate: date('start_date', { mode: 'date' }).notNull(),
  endDate: date('end_date', { mode: 'date' }),
  isCurrent: boolean('is_current').default(false).notNull(),
  grade: varchar('grade', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// === RELACIONAMENTOS ===
export const usersRelations = relations(users, ({ many }) => ({
  experiences: many(experiences),
  educations: many(educations),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, {
    fields: [experiences.userId],
    references: [users.id],
  }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id],
  }),
}));