import { integer, text, pgTable, timestamp, primaryKey, uuid, real } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const waitlistUsers = pgTable("waitlist_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
  gender: text('gender').notNull(),
  phone: text('phone').notNull().unique(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  purchaseHistory: text('purchase_history').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  businessExpenses: integer('business_expenses').notNull(),
  businessGrowthRate: real('business_growth_rate').notNull(),
  customerSatisfactionScore: integer('customer_satisfaction_score').notNull(),
  loyaltyPoints: integer('loyalty_points').notNull(),
  averageOrderValue: integer('average_order_value').notNull(),
});

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  twitterId: text('twitter_id').notNull(),
  username: text('username').notNull(),
  name: text('name').notNull(),
  bio: text('bio'),
  tweet: text('tweet').notNull(),
  followerCount: integer('follower_count').notNull(),
  topics: text('topics').array(),
  status: text('status').default('new'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
