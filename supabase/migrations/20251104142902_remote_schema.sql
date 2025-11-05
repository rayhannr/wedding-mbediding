

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."config" (
    "key" "text" NOT NULL,
    "value" "text" NOT NULL
);


ALTER TABLE "public"."config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitee" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "visit_count" integer DEFAULT 0 NOT NULL,
    "time" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."invitee" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "attendance" "text" DEFAULT ''::"text" NOT NULL,
    "attendees" integer DEFAULT 0 NOT NULL,
    "message" "text" DEFAULT ''::"text" NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "source" "text"
);


ALTER TABLE "public"."rsvp" OWNER TO "postgres";


ALTER TABLE ONLY "public"."config"
    ADD CONSTRAINT "config_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."invitee"
    ADD CONSTRAINT "invitee_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp"
    ADD CONSTRAINT "rsvp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp"
    ADD CONSTRAINT "rsvp_source_fkey" FOREIGN KEY ("source") REFERENCES "public"."invitee"("id") ON DELETE CASCADE;



CREATE POLICY "Authenticated read" ON "public"."config" TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "auth can do all" ON "public"."invitee" TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "authenticated user can do all" ON "public"."rsvp" TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



ALTER TABLE "public"."config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitee" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public can insert" ON "public"."rsvp" FOR INSERT WITH CHECK (true);



CREATE POLICY "public can read" ON "public"."invitee" FOR SELECT USING (true);



CREATE POLICY "public can read" ON "public"."rsvp" FOR SELECT USING (true);



CREATE POLICY "public can update" ON "public"."invitee" FOR UPDATE USING (true);



ALTER TABLE "public"."rsvp" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";












































































































































































































GRANT ALL ON TABLE "public"."config" TO "anon";
GRANT ALL ON TABLE "public"."config" TO "authenticated";
GRANT ALL ON TABLE "public"."config" TO "service_role";



GRANT ALL ON TABLE "public"."invitee" TO "anon";
GRANT ALL ON TABLE "public"."invitee" TO "authenticated";
GRANT ALL ON TABLE "public"."invitee" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp" TO "anon";
GRANT ALL ON TABLE "public"."rsvp" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























drop extension if exists "pg_net";


