/*
 Navicat Premium Dump SQL

 Source Server         : postgres
 Source Server Type    : PostgreSQL
 Source Server Version : 150017 (150017)
 Source Host           : localhost:5432
 Source Catalog        : socialmeme_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150017 (150017)
 File Encoding         : 65001

 Date: 25/06/2026 20:37:40
*/


-- ----------------------------
-- Sequence structure for comments_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."comments_id_seq";
CREATE SEQUENCE "public"."comments_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for likes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."likes_id_seq";
CREATE SEQUENCE "public"."likes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for meme_views_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."meme_views_id_seq";
CREATE SEQUENCE "public"."meme_views_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for memes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."memes_id_seq";
CREATE SEQUENCE "public"."memes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notifications_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notifications_id_seq";
CREATE SEQUENCE "public"."notifications_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for reported_memes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."reported_memes_id_seq";
CREATE SEQUENCE "public"."reported_memes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for shares_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."shares_id_seq";
CREATE SEQUENCE "public"."shares_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for templates_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."templates_id_seq";
CREATE SEQUENCE "public"."templates_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for trend_predictions_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."trend_predictions_id_seq";
CREATE SEQUENCE "public"."trend_predictions_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user_behaviors_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_behaviors_id_seq";
CREATE SEQUENCE "public"."user_behaviors_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for alembic_version
-- ----------------------------
DROP TABLE IF EXISTS "public"."alembic_version";
CREATE TABLE "public"."alembic_version" (
  "version_num" varchar(32) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of alembic_version
-- ----------------------------
INSERT INTO "public"."alembic_version" VALUES ('4d3f8ec4f2a1');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS "public"."comments";
CREATE TABLE "public"."comments" (
  "id" int4 NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "meme_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO "public"."comments" VALUES (1, 1, 1, 'đẹp', '2026-05-21 14:52:30.130127', '2026-05-21 14:52:30.130127');

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS "public"."likes";
CREATE TABLE "public"."likes" (
  "id" int4 NOT NULL DEFAULT nextval('likes_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "meme_id" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO "public"."likes" VALUES (21, 1, 2, '2026-05-21 15:15:19.135207');
INSERT INTO "public"."likes" VALUES (22, 1, 4, '2026-05-21 15:15:25.141833');
INSERT INTO "public"."likes" VALUES (23, 1, 1, '2026-05-21 15:15:28.878788');
INSERT INTO "public"."likes" VALUES (24, 2, 2, '2026-05-22 11:39:26.206495');
INSERT INTO "public"."likes" VALUES (26, 2, 1, '2026-05-22 12:17:42.832483');
INSERT INTO "public"."likes" VALUES (27, 2, 4, '2026-06-18 10:41:11.034576');
INSERT INTO "public"."likes" VALUES (28, 2, 5, '2026-06-18 11:03:46.592377');
INSERT INTO "public"."likes" VALUES (29, 2, 6, '2026-06-18 11:11:03.139593');

-- ----------------------------
-- Table structure for meme_views
-- ----------------------------
DROP TABLE IF EXISTS "public"."meme_views";
CREATE TABLE "public"."meme_views" (
  "id" int4 NOT NULL DEFAULT nextval('meme_views_id_seq'::regclass),
  "user_id" int4,
  "meme_id" int4 NOT NULL,
  "session_id" varchar(100) COLLATE "pg_catalog"."default",
  "view_duration" int4,
  "referrer" varchar(500) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of meme_views
-- ----------------------------
INSERT INTO "public"."meme_views" VALUES (47, 1, 4, NULL, 0, NULL, '2026-04-28 16:22:53.934617');
INSERT INTO "public"."meme_views" VALUES (48, 1, 2, NULL, 0, NULL, '2026-04-28 16:28:38.219308');
INSERT INTO "public"."meme_views" VALUES (50, 1, 1, NULL, 0, NULL, '2026-04-28 16:29:31.370181');
INSERT INTO "public"."meme_views" VALUES (52, 2, 2, NULL, 0, NULL, '2026-05-22 11:39:24.007799');
INSERT INTO "public"."meme_views" VALUES (54, 2, 1, NULL, 0, NULL, '2026-05-22 12:00:54.328153');
INSERT INTO "public"."meme_views" VALUES (56, 2, 4, NULL, 0, NULL, '2026-05-22 12:01:08.273663');
INSERT INTO "public"."meme_views" VALUES (58, 1, 5, NULL, 0, NULL, '2026-05-22 13:22:27.40839');
INSERT INTO "public"."meme_views" VALUES (60, 1, 6, NULL, 0, NULL, '2026-05-22 13:22:44.79668');
INSERT INTO "public"."meme_views" VALUES (62, 2, 6, NULL, 0, NULL, '2026-05-22 13:24:16.886762');
INSERT INTO "public"."meme_views" VALUES (63, 2, 5, NULL, 0, NULL, '2026-05-22 13:42:58.389286');
INSERT INTO "public"."meme_views" VALUES (65, 1, 7, NULL, 0, NULL, '2026-06-25 19:36:44.49619');

-- ----------------------------
-- Table structure for memes
-- ----------------------------
DROP TABLE IF EXISTS "public"."memes";
CREATE TABLE "public"."memes" (
  "id" int4 NOT NULL DEFAULT nextval('memes_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "template_id" int4,
  "image_url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "original_image_url" varchar(500) COLLATE "pg_catalog"."default",
  "caption" text COLLATE "pg_catalog"."default",
  "like_count" int4,
  "view_count" int4,
  "share_count" int4,
  "trending_score" float8,
  "is_trending" bool,
  "predicted_hot_at" timestamp(6),
  "hot_prediction_probability" float8,
  "is_public" bool,
  "is_featured" bool,
  "status" varchar(20) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of memes
-- ----------------------------
INSERT INTO "public"."memes" VALUES (4, 1, NULL, '/uploads/memes/0c5232d9-44b8-4579-b24f-34fa87db0dee.png', NULL, 'Bán máy tính
', 2, 17, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-04-28 16:22:53.75938', '2026-06-25 18:41:41.534064');
INSERT INTO "public"."memes" VALUES (7, 1, NULL, '/uploads/memes/86891fc7-d354-48e2-9f6f-5c0e2e1acd9c.png', NULL, 'SỔ ĐỎ', 0, 2, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-06-25 19:36:44.170873', '2026-06-25 19:36:44.527643');
INSERT INTO "public"."memes" VALUES (1, 1, NULL, '/uploads/memes/252f87d9-1eee-431d-ab24-747bcb9085aa.png', NULL, 'Hello World', 1, 14, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-04-28 04:06:07.482731', '2026-06-18 11:03:42.204966');
INSERT INTO "public"."memes" VALUES (5, 1, NULL, '/uploads/memes/257c1cd6-6e42-4838-a671-e492a22ba593.png', NULL, 'HĐ ', 1, 7, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-05-22 13:22:26.399608', '2026-06-18 11:03:46.592377');
INSERT INTO "public"."memes" VALUES (6, 1, NULL, '/uploads/memes/55d0910d-2966-432c-9158-312c82dbc211.png', NULL, 'HĐ hôm nay
', 1, 8, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-05-22 13:22:44.273153', '2026-06-18 11:11:03.139593');
INSERT INTO "public"."memes" VALUES (2, 1, NULL, '/uploads/memes/393be265-2456-4372-8538-73010de53e33.png', NULL, 'Xin chào ae nha', 2, 20, 0, 0, 'f', NULL, 0, 't', 'f', 'active', '2026-04-28 04:32:28.603811', '2026-06-18 11:11:16.534482');

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."notifications";
CREATE TABLE "public"."notifications" (
  "id" int4 NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "type" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default",
  "extra_data" json,
  "is_read" bool,
  "is_sent" bool,
  "sent_at" timestamp(6),
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO "public"."notifications" VALUES (1, 1, 'like', 'Meme của bạn được thích', 'qtuan đã thích meme của bạn.', '{"meme_id": 4, "actor_id": 2, "action": "like"}', 'f', 'f', NULL, '2026-06-18 10:41:11.034576');
INSERT INTO "public"."notifications" VALUES (2, 1, 'like', 'Meme của bạn được thích', 'qtuan đã thích meme của bạn.', '{"meme_id": 5, "actor_id": 2, "action": "like"}', 'f', 'f', NULL, '2026-06-18 11:03:46.592377');
INSERT INTO "public"."notifications" VALUES (3, 1, 'like', 'Meme của bạn được thích', 'qtuan đã thích meme của bạn.', '{"meme_id": 6, "actor_id": 2, "action": "like"}', 'f', 'f', NULL, '2026-06-18 11:11:03.139593');

-- ----------------------------
-- Table structure for reported_memes
-- ----------------------------
DROP TABLE IF EXISTS "public"."reported_memes";
CREATE TABLE "public"."reported_memes" (
  "id" int4 NOT NULL DEFAULT nextval('reported_memes_id_seq'::regclass),
  "meme_id" int4 NOT NULL,
  "reporter_id" int4 NOT NULL,
  "reason" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "status" varchar(20) COLLATE "pg_catalog"."default",
  "resolved_by" int4,
  "resolved_at" timestamp(6),
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of reported_memes
-- ----------------------------

-- ----------------------------
-- Table structure for shares
-- ----------------------------
DROP TABLE IF EXISTS "public"."shares";
CREATE TABLE "public"."shares" (
  "id" int4 NOT NULL DEFAULT nextval('shares_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "meme_id" int4 NOT NULL,
  "platform" varchar(30) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of shares
-- ----------------------------

-- ----------------------------
-- Table structure for templates
-- ----------------------------
DROP TABLE IF EXISTS "public"."templates";
CREATE TABLE "public"."templates" (
  "id" int4 NOT NULL DEFAULT nextval('templates_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "image_url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "thumbnail_url" varchar(500) COLLATE "pg_catalog"."default",
  "caption_position" varchar(20) COLLATE "pg_catalog"."default",
  "font_size" int4,
  "text_color" varchar(20) COLLATE "pg_catalog"."default",
  "category_tags" varchar[] COLLATE "pg_catalog"."default",
  "emotion_tags" varchar[] COLLATE "pg_catalog"."default",
  "is_active" bool,
  "usage_count" int4,
  "created_by" int4,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of templates
-- ----------------------------

-- ----------------------------
-- Table structure for trend_predictions
-- ----------------------------
DROP TABLE IF EXISTS "public"."trend_predictions";
CREATE TABLE "public"."trend_predictions" (
  "id" int4 NOT NULL DEFAULT nextval('trend_predictions_id_seq'::regclass),
  "meme_id" int4 NOT NULL,
  "likes_1h" int4,
  "views_1h" int4,
  "shares_1h" int4,
  "like_rate_1h" float8,
  "share_rate_1h" float8,
  "view_velocity" float8,
  "hour_post" int4,
  "day_of_week" int4,
  "user_avg_likes" float8,
  "hot_probability" float8,
  "is_predicted_hot" bool,
  "actually_hot" bool,
  "actual_likes_24h" int4,
  "predicted_at" timestamp(6) DEFAULT now(),
  "evaluated_at" timestamp(6)
)
;

-- ----------------------------
-- Records of trend_predictions
-- ----------------------------

-- ----------------------------
-- Table structure for user_behaviors
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_behaviors";
CREATE TABLE "public"."user_behaviors" (
  "id" int8 NOT NULL DEFAULT nextval('user_behaviors_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "meme_id" int4,
  "action_type" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "time_of_day" int4,
  "day_of_week" int4,
  "week_of_year" int4,
  "month" int4,
  "year" int4,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of user_behaviors
-- ----------------------------
INSERT INTO "public"."user_behaviors" VALUES (87, 1, 1, 'view', 16, 1, 18, 4, 2026, '2026-04-28 16:29:31.383351');
INSERT INTO "public"."user_behaviors" VALUES (89, 1, 2, 'like', 17, 1, 18, 4, 2026, '2026-04-28 17:34:51.023369');
INSERT INTO "public"."user_behaviors" VALUES (90, 1, NULL, 'login', 17, 1, 18, 4, 2026, '2026-04-28 17:37:11.281049');
INSERT INTO "public"."user_behaviors" VALUES (91, 1, NULL, 'login', 11, 3, 21, 5, 2026, '2026-05-21 11:29:36.685609');
INSERT INTO "public"."user_behaviors" VALUES (92, 1, 1, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:10.782442');
INSERT INTO "public"."user_behaviors" VALUES (93, 1, 1, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:12.001183');
INSERT INTO "public"."user_behaviors" VALUES (94, 1, 1, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:12.658169');
INSERT INTO "public"."user_behaviors" VALUES (95, 1, 1, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:13.627725');
INSERT INTO "public"."user_behaviors" VALUES (96, 1, 2, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:19.159772');
INSERT INTO "public"."user_behaviors" VALUES (97, 1, 4, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:25.167418');
INSERT INTO "public"."user_behaviors" VALUES (98, 1, 1, 'like', 15, 3, 21, 5, 2026, '2026-05-21 15:15:28.905649');
INSERT INTO "public"."user_behaviors" VALUES (99, 2, 2, 'view', 11, 4, 21, 5, 2026, '2026-05-22 11:39:24.007799');
INSERT INTO "public"."user_behaviors" VALUES (101, 2, 2, 'like', 11, 4, 21, 5, 2026, '2026-05-22 11:39:26.232036');
INSERT INTO "public"."user_behaviors" VALUES (102, 2, NULL, 'login', 11, 4, 21, 5, 2026, '2026-05-22 11:41:43.10001');
INSERT INTO "public"."user_behaviors" VALUES (104, 2, 1, 'view', 12, 4, 21, 5, 2026, '2026-05-22 12:00:54.328153');
INSERT INTO "public"."user_behaviors" VALUES (105, 2, 4, 'view', 12, 4, 21, 5, 2026, '2026-05-22 12:01:08.273663');
INSERT INTO "public"."user_behaviors" VALUES (107, 2, 4, 'like', 12, 4, 21, 5, 2026, '2026-05-22 12:12:43.974275');
INSERT INTO "public"."user_behaviors" VALUES (108, 2, 1, 'like', 12, 4, 21, 5, 2026, '2026-05-22 12:17:42.863926');
INSERT INTO "public"."user_behaviors" VALUES (109, 1, NULL, 'login', 13, 4, 21, 5, 2026, '2026-05-22 13:21:57.366621');
INSERT INTO "public"."user_behaviors" VALUES (110, 1, 5, 'create_meme', 13, 4, 21, 5, 2026, '2026-05-22 13:22:27.359621');
INSERT INTO "public"."user_behaviors" VALUES (111, 1, 5, 'view', 13, 4, 21, 5, 2026, '2026-05-22 13:22:27.40839');
INSERT INTO "public"."user_behaviors" VALUES (113, 1, 6, 'create_meme', 13, 4, 21, 5, 2026, '2026-05-22 13:22:44.750707');
INSERT INTO "public"."user_behaviors" VALUES (114, 1, 6, 'view', 13, 4, 21, 5, 2026, '2026-05-22 13:22:44.79668');
INSERT INTO "public"."user_behaviors" VALUES (116, 2, NULL, 'login', 13, 4, 21, 5, 2026, '2026-05-22 13:23:28.826563');
INSERT INTO "public"."user_behaviors" VALUES (117, 2, 6, 'view', 13, 4, 21, 5, 2026, '2026-05-22 13:24:16.886762');
INSERT INTO "public"."user_behaviors" VALUES (118, 2, 5, 'view', 13, 4, 21, 5, 2026, '2026-05-22 13:42:58.389286');
INSERT INTO "public"."user_behaviors" VALUES (120, 2, NULL, 'login', 10, 3, 25, 6, 2026, '2026-06-18 10:38:41.903433');
INSERT INTO "public"."user_behaviors" VALUES (121, 2, 4, 'like', 10, 3, 25, 6, 2026, '2026-06-18 10:41:11.078461');
INSERT INTO "public"."user_behaviors" VALUES (122, 2, 5, 'like', 11, 3, 25, 6, 2026, '2026-06-18 11:03:46.625173');
INSERT INTO "public"."user_behaviors" VALUES (123, 2, 6, 'like', 11, 3, 25, 6, 2026, '2026-06-18 11:11:03.161831');
INSERT INTO "public"."user_behaviors" VALUES (124, 2, NULL, 'login', 18, 3, 26, 6, 2026, '2026-06-25 18:39:24.613909');
INSERT INTO "public"."user_behaviors" VALUES (125, 1, NULL, 'login', 18, 3, 26, 6, 2026, '2026-06-25 18:49:49.907159');
INSERT INTO "public"."user_behaviors" VALUES (126, 1, NULL, 'login', 19, 3, 26, 6, 2026, '2026-06-25 19:34:32.912727');
INSERT INTO "public"."user_behaviors" VALUES (127, 1, 7, 'create_meme', 19, 3, 26, 6, 2026, '2026-06-25 19:36:44.446006');
INSERT INTO "public"."user_behaviors" VALUES (128, 1, 7, 'view', 19, 3, 26, 6, 2026, '2026-06-25 19:36:44.49619');
INSERT INTO "public"."user_behaviors" VALUES (79, 1, NULL, 'create_meme', 16, 1, 18, 4, 2026, '2026-04-28 09:00:03.985056');
INSERT INTO "public"."user_behaviors" VALUES (80, 1, NULL, 'view', 16, 1, 18, 4, 2026, '2026-04-28 09:00:04.050835');
INSERT INTO "public"."user_behaviors" VALUES (82, 1, 4, 'create_meme', 16, 1, 18, 4, 2026, '2026-04-28 16:22:53.888979');
INSERT INTO "public"."user_behaviors" VALUES (83, 1, 4, 'view', 16, 1, 18, 4, 2026, '2026-04-28 16:22:53.944352');
INSERT INTO "public"."user_behaviors" VALUES (84, 1, 2, 'view', 16, 1, 18, 4, 2026, '2026-04-28 16:28:38.234011');
INSERT INTO "public"."user_behaviors" VALUES (86, 1, 2, 'like', 16, 1, 18, 4, 2026, '2026-04-28 16:28:39.760907');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password_hash" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "avatar_url" varchar(255) COLLATE "pg_catalog"."default",
  "bio" varchar(500) COLLATE "pg_catalog"."default",
  "role" varchar(20) COLLATE "pg_catalog"."default",
  "is_active" bool,
  "last_login" timestamp(6),
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "is_verified" bool NOT NULL,
  "email_verified_at" timestamp(6)
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (1, 'test', 'test@test.com', '$2b$12$/mRH/R8sJyUkN1CzEkHHXO2xB5IcPLjN75llPNS/YLwGxLzTmB6sa', '/static/default-avatar.png', '', 'user', 't', NULL, '2026-04-28 04:00:52.330113', '2026-04-28 04:00:52.330113', 't', NULL);
INSERT INTO "public"."users" VALUES (2, 'qtuan', 'qtuan@yopmail.com', '$2b$12$X0mlxMIvcjmi2MytshEmYeYUp1jtU1UnCg.KKw5e8NA.JRNOhunv2', '/static/default-avatar.png', '', 'admin', 't', NULL, '2026-05-22 11:28:55.219415', '2026-05-22 11:28:55.219415', 't', NULL);
INSERT INTO "public"."users" VALUES (3, 'tuan2', 'tuan2@yopmail.com', '$2b$12$fobS/SklebLk6eKr0bgrJ.La.7eRObLzJ1YxNaLJlH0ooKWm3gfti', '/static/default-avatar.png', '', 'user', 't', NULL, '2026-06-25 20:30:35.948492', '2026-06-25 20:30:35.948492', 't', NULL);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."comments_id_seq"
OWNED BY "public"."comments"."id";
SELECT setval('"public"."comments_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."likes_id_seq"
OWNED BY "public"."likes"."id";
SELECT setval('"public"."likes_id_seq"', 29, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."meme_views_id_seq"
OWNED BY "public"."meme_views"."id";
SELECT setval('"public"."meme_views_id_seq"', 65, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."memes_id_seq"
OWNED BY "public"."memes"."id";
SELECT setval('"public"."memes_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notifications_id_seq"
OWNED BY "public"."notifications"."id";
SELECT setval('"public"."notifications_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."reported_memes_id_seq"
OWNED BY "public"."reported_memes"."id";
SELECT setval('"public"."reported_memes_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."shares_id_seq"
OWNED BY "public"."shares"."id";
SELECT setval('"public"."shares_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."templates_id_seq"
OWNED BY "public"."templates"."id";
SELECT setval('"public"."templates_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."trend_predictions_id_seq"
OWNED BY "public"."trend_predictions"."id";
SELECT setval('"public"."trend_predictions_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."user_behaviors_id_seq"
OWNED BY "public"."user_behaviors"."id";
SELECT setval('"public"."user_behaviors_id_seq"', 128, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 3, true);

-- ----------------------------
-- Primary Key structure for table alembic_version
-- ----------------------------
ALTER TABLE "public"."alembic_version" ADD CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num");

-- ----------------------------
-- Indexes structure for table comments
-- ----------------------------
CREATE INDEX "ix_comments_id" ON "public"."comments" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_comments_meme_id" ON "public"."comments" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_comments_user_id" ON "public"."comments" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table comments
-- ----------------------------
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table likes
-- ----------------------------
CREATE INDEX "ix_likes_created_at" ON "public"."likes" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_likes_id" ON "public"."likes" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_likes_meme_id" ON "public"."likes" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_likes_user_id" ON "public"."likes" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table likes
-- ----------------------------
ALTER TABLE "public"."likes" ADD CONSTRAINT "unique_user_meme_like" UNIQUE ("user_id", "meme_id");

-- ----------------------------
-- Primary Key structure for table likes
-- ----------------------------
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table meme_views
-- ----------------------------
CREATE INDEX "ix_meme_views_created_at" ON "public"."meme_views" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_meme_views_id" ON "public"."meme_views" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_meme_views_meme_id" ON "public"."meme_views" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_meme_views_user_id" ON "public"."meme_views" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table meme_views
-- ----------------------------
ALTER TABLE "public"."meme_views" ADD CONSTRAINT "unique_user_meme_daily_view" UNIQUE ("user_id", "meme_id");

-- ----------------------------
-- Primary Key structure for table meme_views
-- ----------------------------
ALTER TABLE "public"."meme_views" ADD CONSTRAINT "meme_views_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table memes
-- ----------------------------
CREATE INDEX "ix_memes_id" ON "public"."memes" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table memes
-- ----------------------------
ALTER TABLE "public"."memes" ADD CONSTRAINT "memes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table notifications
-- ----------------------------
CREATE INDEX "ix_notifications_created_at" ON "public"."notifications" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_notifications_id" ON "public"."notifications" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_notifications_user_id" ON "public"."notifications" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table reported_memes
-- ----------------------------
CREATE INDEX "ix_reported_memes_created_at" ON "public"."reported_memes" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_reported_memes_id" ON "public"."reported_memes" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_reported_memes_meme_id" ON "public"."reported_memes" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_reported_memes_reporter_id" ON "public"."reported_memes" USING btree (
  "reporter_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table reported_memes
-- ----------------------------
ALTER TABLE "public"."reported_memes" ADD CONSTRAINT "unique_user_meme_report" UNIQUE ("meme_id", "reporter_id");

-- ----------------------------
-- Primary Key structure for table reported_memes
-- ----------------------------
ALTER TABLE "public"."reported_memes" ADD CONSTRAINT "reported_memes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table shares
-- ----------------------------
CREATE INDEX "ix_shares_created_at" ON "public"."shares" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_shares_id" ON "public"."shares" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_shares_meme_id" ON "public"."shares" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_shares_user_id" ON "public"."shares" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table shares
-- ----------------------------
ALTER TABLE "public"."shares" ADD CONSTRAINT "shares_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table templates
-- ----------------------------
CREATE INDEX "ix_templates_id" ON "public"."templates" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ix_templates_slug" ON "public"."templates" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table templates
-- ----------------------------
ALTER TABLE "public"."templates" ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table trend_predictions
-- ----------------------------
CREATE INDEX "ix_trend_predictions_id" ON "public"."trend_predictions" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ix_trend_predictions_meme_id" ON "public"."trend_predictions" USING btree (
  "meme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table trend_predictions
-- ----------------------------
ALTER TABLE "public"."trend_predictions" ADD CONSTRAINT "trend_predictions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_behaviors
-- ----------------------------
CREATE INDEX "idx_behaviors_user_action_time" ON "public"."user_behaviors" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "action_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_user_behaviors_action_type" ON "public"."user_behaviors" USING btree (
  "action_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "ix_user_behaviors_created_at" ON "public"."user_behaviors" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ix_user_behaviors_id" ON "public"."user_behaviors" USING btree (
  "id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "ix_user_behaviors_user_id" ON "public"."user_behaviors" USING btree (
  "user_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table user_behaviors
-- ----------------------------
ALTER TABLE "public"."user_behaviors" ADD CONSTRAINT "user_behaviors_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX "ix_users_email" ON "public"."users" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "ix_users_id" ON "public"."users" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ix_users_username" ON "public"."users" USING btree (
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table comments
-- ----------------------------
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table likes
-- ----------------------------
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table meme_views
-- ----------------------------
ALTER TABLE "public"."meme_views" ADD CONSTRAINT "meme_views_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."meme_views" ADD CONSTRAINT "meme_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table memes
-- ----------------------------
ALTER TABLE "public"."memes" ADD CONSTRAINT "memes_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."templates" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."memes" ADD CONSTRAINT "memes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table reported_memes
-- ----------------------------
ALTER TABLE "public"."reported_memes" ADD CONSTRAINT "reported_memes_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."reported_memes" ADD CONSTRAINT "reported_memes_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."reported_memes" ADD CONSTRAINT "reported_memes_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table shares
-- ----------------------------
ALTER TABLE "public"."shares" ADD CONSTRAINT "shares_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."shares" ADD CONSTRAINT "shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table templates
-- ----------------------------
ALTER TABLE "public"."templates" ADD CONSTRAINT "templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table trend_predictions
-- ----------------------------
ALTER TABLE "public"."trend_predictions" ADD CONSTRAINT "trend_predictions_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_behaviors
-- ----------------------------
ALTER TABLE "public"."user_behaviors" ADD CONSTRAINT "user_behaviors_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."user_behaviors" ADD CONSTRAINT "user_behaviors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
