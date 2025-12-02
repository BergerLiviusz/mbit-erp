-- CreateTable
CREATE TABLE "workflowok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "workflowok_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workflow_lepesek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "sorrend" INTEGER NOT NULL,
    "szerepkorId" TEXT,
    "jogosultsag" TEXT NOT NULL DEFAULT 'READ',
    "kotelezo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workflow_lepesek_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflowok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workflow_lepesek_szerepkorId_fkey" FOREIGN KEY ("szerepkorId") REFERENCES "szerepkorok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "workflowok_aktiv_idx" ON "workflowok"("aktiv");

-- CreateIndex
CREATE INDEX "workflowok_createdById_idx" ON "workflowok"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_lepesek_workflowId_sorrend_key" ON "workflow_lepesek"("workflowId", "sorrend");

-- CreateIndex
CREATE INDEX "workflow_lepesek_workflowId_idx" ON "workflow_lepesek"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_lepesek_szerepkorId_idx" ON "workflow_lepesek"("szerepkorId");

