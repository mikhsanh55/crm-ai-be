-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('ADS', 'REFERRAL', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "website" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "lead_source" "LeadSource" NOT NULL,
    "status" "ContactStatus" NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "close_date" TIMESTAMP(3),

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_stages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "pipeline_id" TEXT NOT NULL,

    CONSTRAINT "deal_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "deal_id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_ai_summaries" (
    "id" TEXT NOT NULL,
    "deal_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "activity_ai_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "assigned_to" TEXT NOT NULL,
    "contact_id" TEXT,
    "deal_id" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactTag" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "ContactTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "deal_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_stages" ADD CONSTRAINT "deal_stages_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_ai_summaries" ADD CONSTRAINT "activity_ai_summaries_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_ai_summaries" ADD CONSTRAINT "activity_ai_summaries_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
