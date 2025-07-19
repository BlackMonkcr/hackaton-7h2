-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('UNIVERSITY', 'STARTUP', 'SME', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('ACADEMIC_PROJECT', 'THESIS', 'STARTUP_MVP', 'STARTUP_PRODUCT', 'BUSINESS_PLAN', 'RESEARCH', 'COURSEWORK', 'GROUP_ASSIGNMENT', 'PERSONAL_PROJECT', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('OWNER', 'COORDINATOR', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "SprintStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'DISMISSED');

-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI_GPT', 'CLAUDE', 'DEEPSEEK', 'GEMINI');

-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('SIMPLE_DEADLINES', 'KANBAN', 'SPRINTS', 'GANTT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('PERSONAL', 'PROJECT', 'MILESTONE', 'RECURRING');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('PLANNING', 'CONFIGURATION', 'AI_GENERATION', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAUSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profileImage" TEXT,
    "university" TEXT,
    "studentId" TEXT,
    "career" TEXT,
    "semester" INTEGER,
    "companyName" TEXT,
    "position" TEXT,
    "industry" TEXT,
    "companySize" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectType" "ProjectType" NOT NULL DEFAULT 'UNIVERSITY',
    "category" "ProjectCategory" NOT NULL DEFAULT 'ACADEMIC_PROJECT',
    "projectStage" "ProjectStage" NOT NULL DEFAULT 'PLANNING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "joinCode" TEXT,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiProvider" "AIProvider" NOT NULL DEFAULT 'OPENAI_GPT',
    "workflowType" "WorkflowType" NOT NULL DEFAULT 'SIMPLE_DEADLINES',
    "usesSprints" BOOLEAN NOT NULL DEFAULT false,
    "usesKanban" BOOLEAN NOT NULL DEFAULT true,
    "allowsSubtasks" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "courseCode" TEXT,
    "courseName" TEXT,
    "professor" TEXT,
    "semester" TEXT,
    "academicYear" TEXT,
    "university" TEXT,
    "industry" TEXT,
    "startupStage" TEXT,
    "teamSize" INTEGER,
    "fundingGoal" DOUBLE PRECISION,
    "businessModel" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "taskType" "TaskType" NOT NULL DEFAULT 'PERSONAL',
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnId" TEXT,
    "position" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" INTEGER DEFAULT 1,
    "complexity" TEXT,
    "skillsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deliverableType" TEXT,
    "rubricCriteria" JSONB,
    "impactLevel" TEXT,
    "customerValue" TEXT,
    "riskLevel" TEXT,
    "projectId" TEXT,
    "assigneeId" TEXT,
    "createdById" TEXT NOT NULL,
    "sprintId" TEXT,
    "milestoneId" TEXT,
    "parentTaskId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "status" "SprintStatus" NOT NULL DEFAULT 'PLANNING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_blocks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePattern" TEXT,
    "blockType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "AIProvider" NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "tokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "context" TEXT,
    "projectId" TEXT,
    "configurationUsed" JSONB,
    "generationType" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kanban_columns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "color" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kanban_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_sessions" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultWorkflowType" "WorkflowType" NOT NULL DEFAULT 'SIMPLE_DEADLINES',
    "preferredWorkHours" JSONB,
    "timeBlockSize" INTEGER NOT NULL DEFAULT 30,
    "autoScheduling" BOOLEAN NOT NULL DEFAULT true,
    "aiSuggestions" BOOLEAN NOT NULL DEFAULT true,
    "preferredAI" "AIProvider" NOT NULL DEFAULT 'OPENAI_GPT',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderMinutes" INTEGER NOT NULL DEFAULT 15,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'es',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "structure" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "resourceType" TEXT NOT NULL,
    "projectId" TEXT,
    "taskId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT,
    "projectId" TEXT,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_configurations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "requiredWeeks" INTEGER NOT NULL,
    "availablePersonnel" JSONB NOT NULL,
    "workSector" TEXT NOT NULL,
    "tasksToResolve" TEXT NOT NULL,
    "tasksPriority" TEXT NOT NULL,
    "availableBudget" DOUBLE PRECISION,
    "specialRestrictions" TEXT,
    "projectStartDate" TIMESTAMP(3) NOT NULL,
    "projectEndDate" TIMESTAMP(3) NOT NULL,
    "aiPromptTemplate" TEXT,
    "generatedTasks" JSONB,
    "lastAIGeneration" TIMESTAMP(3),
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "needsRegeneration" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "category" "ProjectCategory",
    "promptTemplate" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION DEFAULT 0.7,
    "maxTokens" INTEGER DEFAULT 4000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_analytics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "overdueTasks" INTEGER NOT NULL DEFAULT 0,
    "avgTaskDuration" DOUBLE PRECISION,
    "originalDeadline" TIMESTAMP(3),
    "currentEstimatedEnd" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "teamUtilization" DOUBLE PRECISION,
    "taskDistribution" JSONB,
    "aiGenerationAccuracy" DOUBLE PRECISION,
    "aiSuggestionsUsed" INTEGER NOT NULL DEFAULT 0,
    "aiCostTotal" DOUBLE PRECISION,
    "riskLevel" TEXT,
    "completionProbability" DOUBLE PRECISION,
    "recommendedActions" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskBlockers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskBlockers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "projects_joinCode_key" ON "projects"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_userId_key" ON "project_members"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "kanban_columns_projectId_position_key" ON "kanban_columns"("projectId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_configurations_projectId_key" ON "project_configurations"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_analytics_projectId_key" ON "project_analytics"("projectId");

-- CreateIndex
CREATE INDEX "_TaskBlockers_B_index" ON "_TaskBlockers"("B");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_blocks" ADD CONSTRAINT "schedule_blocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_blocks" ADD CONSTRAINT "schedule_blocks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_columns" ADD CONSTRAINT "kanban_columns_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_configurations" ADD CONSTRAINT "project_configurations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompt_templates" ADD CONSTRAINT "ai_prompt_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_analytics" ADD CONSTRAINT "project_analytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskBlockers" ADD CONSTRAINT "_TaskBlockers_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskBlockers" ADD CONSTRAINT "_TaskBlockers_B_fkey" FOREIGN KEY ("B") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
