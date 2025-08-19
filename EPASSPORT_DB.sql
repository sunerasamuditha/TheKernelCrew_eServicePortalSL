--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-16 18:14:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 907 (class 1247 OID 16427)
-- Name: application_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.application_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'BIOMETRICS_PENDING',
    'IN_REVIEW',
    'PHOTO_REJECTED',
    'DOCUMENTS_PENDING',
    'PAYMENT_PENDING',
    'PAYMENT_SUCCESS',
    'PASSPORT_PRINTED',
    'READY_FOR_COLLECTION',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.application_status OWNER TO postgres;

--
-- TOC entry 916 (class 1247 OID 16472)
-- Name: channel_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.channel_type AS ENUM (
    'SMS',
    'EMAIL',
    'PUSH'
);


ALTER TYPE public.channel_type OWNER TO postgres;

--
-- TOC entry 919 (class 1247 OID 16480)
-- Name: doc_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.doc_type AS ENUM (
    'BIRTH_CERTIFICATE',
    'NIC_FRONT',
    'NIC_BACK',
    'MARRIAGE_CERTIFICATE',
    'OLD_PASSPORT',
    'OTHER'
);


ALTER TYPE public.doc_type OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 16462)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'INITIATED',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 922 (class 1247 OID 16494)
-- Name: traffic_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.traffic_level AS ENUM (
    'LOW',
    'MODERATE',
    'HIGH'
);


ALTER TYPE public.traffic_level OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 16452)
-- Name: verification_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_status AS ENUM (
    'PENDING',
    'UPLOADED',
    'VERIFIED',
    'REJECTED'
);


ALTER TYPE public.verification_status OWNER TO postgres;

--
-- TOC entry 278 (class 1255 OID 16501)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16535)
-- Name: application_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_status_history (
    id bigint NOT NULL,
    application_id uuid NOT NULL,
    status public.application_status,
    note text,
    changed_by uuid,
    changed_at timestamp with time zone
);


ALTER TABLE public.application_status_history OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16534)
-- Name: application_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_status_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 221
-- Name: application_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_status_history_id_seq OWNED BY public.application_status_history.id;


--
-- TOC entry 220 (class 1259 OID 16521)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(30),
    current_status public.application_status,
    submitted_at timestamp with time zone,
    service_level character varying(20),
    service_fee_cents integer,
    total_fee_cents integer,
    locker_enabled boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16639)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    time_slot_id uuid NOT NULL,
    qr_code text,
    status public.verification_status,
    booked_at timestamp with time zone
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16603)
-- Name: biometric_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biometric_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    method character varying(30),
    status public.verification_status,
    captured_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.biometric_enrollments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16512)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(150),
    address character varying(255),
    district character varying(120),
    geo point,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16560)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    doc_type public.doc_type,
    file_url text,
    ocr_text text,
    extracted_json jsonb,
    verification public.verification_status,
    verifier_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16699)
-- Name: helpbot_conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.helpbot_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone
);


ALTER TABLE public.helpbot_conversations OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16711)
-- Name: helpbot_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.helpbot_messages (
    id bigint NOT NULL,
    conversation_id uuid NOT NULL,
    sender character varying(10),
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.helpbot_messages OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16710)
-- Name: helpbot_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.helpbot_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.helpbot_messages_id_seq OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 237
-- Name: helpbot_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.helpbot_messages_id_seq OWNED BY public.helpbot_messages.id;


--
-- TOC entry 226 (class 1259 OID 16575)
-- Name: locker_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locker_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    doc_type public.doc_type,
    file_url text,
    issued_by character varying(200),
    verified boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    note text
);


ALTER TABLE public.locker_files OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16681)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    application_id uuid,
    channel public.channel_type,
    title character varying(200),
    message text,
    sent_at timestamp with time zone,
    meta jsonb
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16680)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 234
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 239 (class 1259 OID 16725)
-- Name: officers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.officers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(150),
    branch_id uuid,
    role character varying(50),
    active boolean
);


ALTER TABLE public.officers OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16549)
-- Name: otp_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_logs (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    code_hash character varying(200),
    sent_at timestamp with time zone,
    expires_at timestamp with time zone,
    verified_at timestamp with time zone
);


ALTER TABLE public.otp_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16548)
-- Name: otp_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 223
-- Name: otp_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_logs_id_seq OWNED BY public.otp_logs.id;


--
-- TOC entry 229 (class 1259 OID 16615)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    gateway character varying(50),
    amount_cents integer,
    currency character varying(10),
    status public.payment_status,
    gateway_txn_id character varying(120),
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16589)
-- Name: photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    file_url text,
    icao_passed boolean,
    checks_json jsonb,
    liveness_score numeric(5,2),
    reviewed_status public.verification_status,
    reviewer_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.photos OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16663)
-- Name: queue_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queue_tokens (
    id bigint NOT NULL,
    branch_id uuid NOT NULL,
    appointment_id uuid NOT NULL,
    token_number integer,
    now_serving_at_gen time without time zone,
    estimated_wait_min integer,
    counter_number integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.queue_tokens OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16662)
-- Name: queue_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queue_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queue_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 232
-- Name: queue_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queue_tokens_id_seq OWNED BY public.queue_tokens.id;


--
-- TOC entry 241 (class 1259 OID 16738)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    application_id uuid NOT NULL,
    officer_id uuid,
    review_type character varying(30),
    result public.verification_status,
    remarks text,
    reviewed_at timestamp with time zone
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16737)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 240
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 230 (class 1259 OID 16627)
-- Name: time_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.time_slots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    branch_id uuid NOT NULL,
    slot_date date,
    slot_time time without time zone,
    capacity integer,
    predicted_wait integer,
    traffic public.traffic_level,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.time_slots OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16502)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mobile_number character varying(20),
    email character varying(255),
    password_hash text,
    nic_number character varying(20),
    full_name character varying(200),
    dob date,
    address_line1 character varying(255),
    address_line2 character varying(255),
    district character varying(120),
    language_pref character varying(10),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4879 (class 2604 OID 16538)
-- Name: application_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status_history ALTER COLUMN id SET DEFAULT nextval('public.application_status_history_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16714)
-- Name: helpbot_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helpbot_messages ALTER COLUMN id SET DEFAULT nextval('public.helpbot_messages_id_seq'::regclass);


--
-- TOC entry 4897 (class 2604 OID 16684)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 16552)
-- Name: otp_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_logs ALTER COLUMN id SET DEFAULT nextval('public.otp_logs_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16666)
-- Name: queue_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_tokens ALTER COLUMN id SET DEFAULT nextval('public.queue_tokens_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16741)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 5133 (class 0 OID 16535)
-- Dependencies: 222
-- Data for Name: application_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_status_history (id, application_id, status, note, changed_by, changed_at) FROM stdin;
\.


--
-- TOC entry 5131 (class 0 OID 16521)
-- Dependencies: 220
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, user_id, type, current_status, submitted_at, service_level, service_fee_cents, total_fee_cents, locker_enabled, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5142 (class 0 OID 16639)
-- Dependencies: 231
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, application_id, branch_id, time_slot_id, qr_code, status, booked_at) FROM stdin;
\.


--
-- TOC entry 5139 (class 0 OID 16603)
-- Dependencies: 228
-- Data for Name: biometric_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.biometric_enrollments (id, application_id, method, status, captured_at, created_at) FROM stdin;
\.


--
-- TOC entry 5130 (class 0 OID 16512)
-- Dependencies: 219
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, name, address, district, geo, created_at) FROM stdin;
\.


--
-- TOC entry 5136 (class 0 OID 16560)
-- Dependencies: 225
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, application_id, doc_type, file_url, ocr_text, extracted_json, verification, verifier_note, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5147 (class 0 OID 16699)
-- Dependencies: 236
-- Data for Name: helpbot_conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.helpbot_conversations (id, user_id, started_at, ended_at) FROM stdin;
\.


--
-- TOC entry 5149 (class 0 OID 16711)
-- Dependencies: 238
-- Data for Name: helpbot_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.helpbot_messages (id, conversation_id, sender, content, created_at) FROM stdin;
\.


--
-- TOC entry 5137 (class 0 OID 16575)
-- Dependencies: 226
-- Data for Name: locker_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locker_files (id, user_id, doc_type, file_url, issued_by, verified, created_at, note) FROM stdin;
\.


--
-- TOC entry 5146 (class 0 OID 16681)
-- Dependencies: 235
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, application_id, channel, title, message, sent_at, meta) FROM stdin;
\.


--
-- TOC entry 5150 (class 0 OID 16725)
-- Dependencies: 239
-- Data for Name: officers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.officers (id, name, branch_id, role, active) FROM stdin;
\.


--
-- TOC entry 5135 (class 0 OID 16549)
-- Dependencies: 224
-- Data for Name: otp_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_logs (id, user_id, code_hash, sent_at, expires_at, verified_at) FROM stdin;
\.


--
-- TOC entry 5140 (class 0 OID 16615)
-- Dependencies: 229
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, application_id, gateway, amount_cents, currency, status, gateway_txn_id, paid_at, created_at) FROM stdin;
\.


--
-- TOC entry 5138 (class 0 OID 16589)
-- Dependencies: 227
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.photos (id, application_id, file_url, icao_passed, checks_json, liveness_score, reviewed_status, reviewer_note, created_at) FROM stdin;
\.


--
-- TOC entry 5144 (class 0 OID 16663)
-- Dependencies: 233
-- Data for Name: queue_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queue_tokens (id, branch_id, appointment_id, token_number, now_serving_at_gen, estimated_wait_min, counter_number, created_at) FROM stdin;
\.


--
-- TOC entry 5152 (class 0 OID 16738)
-- Dependencies: 241
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, application_id, officer_id, review_type, result, remarks, reviewed_at) FROM stdin;
\.


--
-- TOC entry 5141 (class 0 OID 16627)
-- Dependencies: 230
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.time_slots (id, branch_id, slot_date, slot_time, capacity, predicted_wait, traffic, created_at) FROM stdin;
\.


--
-- TOC entry 5129 (class 0 OID 16502)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, mobile_number, email, password_hash, nic_number, full_name, dob, address_line1, address_line2, district, language_pref, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 221
-- Name: application_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_status_history_id_seq', 1, false);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 237
-- Name: helpbot_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.helpbot_messages_id_seq', 1, false);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 234
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 223
-- Name: otp_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_logs_id_seq', 1, false);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 232
-- Name: queue_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_tokens_id_seq', 1, false);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 240
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 4911 (class 2606 OID 16542)
-- Name: application_status_history application_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 16528)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 16646)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 16609)
-- Name: biometric_enrollments biometric_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biometric_enrollments
    ADD CONSTRAINT biometric_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 16520)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 2606 OID 16569)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 16704)
-- Name: helpbot_conversations helpbot_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helpbot_conversations
    ADD CONSTRAINT helpbot_conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 16719)
-- Name: helpbot_messages helpbot_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helpbot_messages
    ADD CONSTRAINT helpbot_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16583)
-- Name: locker_files locker_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locker_files
    ADD CONSTRAINT locker_files_pkey PRIMARY KEY (id);


--
-- TOC entry 4946 (class 2606 OID 16688)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16730)
-- Name: officers officers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 16554)
-- Name: otp_logs otp_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_logs
    ADD CONSTRAINT otp_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 16621)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 16597)
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 16669)
-- Name: queue_tokens queue_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_tokens
    ADD CONSTRAINT queue_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 16745)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 16633)
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 16511)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 1259 OID 16759)
-- Name: idx_applications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_user_id ON public.applications USING btree (user_id);


--
-- TOC entry 4935 (class 1259 OID 16766)
-- Name: idx_appts_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appts_application_id ON public.appointments USING btree (application_id);


--
-- TOC entry 4936 (class 1259 OID 16767)
-- Name: idx_appts_branch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appts_branch_id ON public.appointments USING btree (branch_id);


--
-- TOC entry 4937 (class 1259 OID 16768)
-- Name: idx_appts_time_slot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appts_time_slot_id ON public.appointments USING btree (time_slot_id);


--
-- TOC entry 4926 (class 1259 OID 16763)
-- Name: idx_bio_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bio_application_id ON public.biometric_enrollments USING btree (application_id);


--
-- TOC entry 4917 (class 1259 OID 16761)
-- Name: idx_docs_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_docs_application_id ON public.documents USING btree (application_id);


--
-- TOC entry 4918 (class 1259 OID 16778)
-- Name: idx_documents_extracted_json_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_extracted_json_gin ON public.documents USING gin (extracted_json);


--
-- TOC entry 4949 (class 1259 OID 16773)
-- Name: idx_hb_conv_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hb_conv_user_id ON public.helpbot_conversations USING btree (user_id);


--
-- TOC entry 4952 (class 1259 OID 16774)
-- Name: idx_hb_msgs_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hb_msgs_conversation_id ON public.helpbot_messages USING btree (conversation_id);


--
-- TOC entry 4942 (class 1259 OID 16772)
-- Name: idx_notif_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_application_id ON public.notifications USING btree (application_id);


--
-- TOC entry 4943 (class 1259 OID 16771)
-- Name: idx_notif_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 4944 (class 1259 OID 16779)
-- Name: idx_notifications_meta_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_meta_gin ON public.notifications USING gin (meta);


--
-- TOC entry 4953 (class 1259 OID 16775)
-- Name: idx_officers_branch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_officers_branch_id ON public.officers USING btree (branch_id);


--
-- TOC entry 4912 (class 1259 OID 16760)
-- Name: idx_otp_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_otp_logs_user_id ON public.otp_logs USING btree (user_id);


--
-- TOC entry 4927 (class 1259 OID 16764)
-- Name: idx_payments_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_application_id ON public.payments USING btree (application_id);


--
-- TOC entry 4921 (class 1259 OID 16762)
-- Name: idx_photos_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_photos_application_id ON public.photos USING btree (application_id);


--
-- TOC entry 4938 (class 1259 OID 16770)
-- Name: idx_qtokens_appointment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_qtokens_appointment_id ON public.queue_tokens USING btree (appointment_id);


--
-- TOC entry 4939 (class 1259 OID 16769)
-- Name: idx_qtokens_branch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_qtokens_branch_id ON public.queue_tokens USING btree (branch_id);


--
-- TOC entry 4956 (class 1259 OID 16776)
-- Name: idx_reviews_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_application_id ON public.reviews USING btree (application_id);


--
-- TOC entry 4957 (class 1259 OID 16777)
-- Name: idx_reviews_officer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_officer_id ON public.reviews USING btree (officer_id);


--
-- TOC entry 4930 (class 1259 OID 16765)
-- Name: idx_timeslots_branch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_timeslots_branch_id ON public.time_slots USING btree (branch_id);


--
-- TOC entry 4982 (class 2620 OID 16757)
-- Name: applications trg_applications_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4983 (class 2620 OID 16758)
-- Name: documents trg_documents_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4981 (class 2620 OID 16756)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4961 (class 2606 OID 16543)
-- Name: application_status_history application_status_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4960 (class 2606 OID 16529)
-- Name: applications applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4969 (class 2606 OID 16647)
-- Name: appointments appointments_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4970 (class 2606 OID 16652)
-- Name: appointments appointments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE RESTRICT;


--
-- TOC entry 4971 (class 2606 OID 16657)
-- Name: appointments appointments_time_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_time_slot_id_fkey FOREIGN KEY (time_slot_id) REFERENCES public.time_slots(id) ON DELETE RESTRICT;


--
-- TOC entry 4966 (class 2606 OID 16610)
-- Name: biometric_enrollments biometric_enrollments_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biometric_enrollments
    ADD CONSTRAINT biometric_enrollments_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4963 (class 2606 OID 16570)
-- Name: documents documents_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4976 (class 2606 OID 16705)
-- Name: helpbot_conversations helpbot_conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helpbot_conversations
    ADD CONSTRAINT helpbot_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4977 (class 2606 OID 16720)
-- Name: helpbot_messages helpbot_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helpbot_messages
    ADD CONSTRAINT helpbot_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.helpbot_conversations(id) ON DELETE CASCADE;


--
-- TOC entry 4964 (class 2606 OID 16584)
-- Name: locker_files locker_files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locker_files
    ADD CONSTRAINT locker_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4974 (class 2606 OID 16694)
-- Name: notifications notifications_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4975 (class 2606 OID 16689)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4978 (class 2606 OID 16731)
-- Name: officers officers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- TOC entry 4962 (class 2606 OID 16555)
-- Name: otp_logs otp_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_logs
    ADD CONSTRAINT otp_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4967 (class 2606 OID 16622)
-- Name: payments payments_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4965 (class 2606 OID 16598)
-- Name: photos photos_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4972 (class 2606 OID 16675)
-- Name: queue_tokens queue_tokens_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_tokens
    ADD CONSTRAINT queue_tokens_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- TOC entry 4973 (class 2606 OID 16670)
-- Name: queue_tokens queue_tokens_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_tokens
    ADD CONSTRAINT queue_tokens_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- TOC entry 4979 (class 2606 OID 16746)
-- Name: reviews reviews_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 4980 (class 2606 OID 16751)
-- Name: reviews reviews_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.officers(id) ON DELETE SET NULL;


--
-- TOC entry 4968 (class 2606 OID 16634)
-- Name: time_slots time_slots_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


-- Completed on 2025-08-16 18:14:51

--
-- PostgreSQL database dump complete
--

