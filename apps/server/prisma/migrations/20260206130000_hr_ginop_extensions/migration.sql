-- HR GINOP 1.5 bővítések: cafeteria, toborzás, idő, távollét, teljesítmény, beléptetés, workflow–dolgozó kapcsolat

-- Munkakör: opcionális DMS munkaköri leírás doksi
ALTER TABLE "munkakorok" ADD COLUMN "jobDescriptionDocumentId" TEXT REFERENCES "dokumentumok" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX "munkakorok_jobDescriptionDocumentId_key" ON "munkakorok"("jobDescriptionDocumentId");

-- Workflow példány: kötés dolgozóhoz (beléptetés, HR folyamatok)
ALTER TABLE "workflow_peldanyok" ADD COLUMN "subjectEmployeeId" TEXT REFERENCES "dolgozok" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "korabbi_munkahelyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "munkaadoNev" TEXT NOT NULL,
    "munkakor" TEXT,
    "kezdet" DATETIME,
    "veg" DATETIME,
    "megjegyzes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "korabbi_munkahelyek_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "korabbi_munkahelyek_employeeId_idx" ON "korabbi_munkahelyek"("employeeId");

CREATE TABLE "dolgozo_kituntetesek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "megnevezes" TEXT NOT NULL,
    "datum" DATETIME NOT NULL,
    "intezmeny" TEXT,
    "megjegyzes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dolgozo_kituntetesek_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "dolgozo_kituntetesek_employeeId_idx" ON "dolgozo_kituntetesek"("employeeId");

CREATE TABLE "cafeteria_juttatas_csoportok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "ev" INTEGER,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "cafeteria_juttatas_csoportok_ev_idx" ON "cafeteria_juttatas_csoportok"("ev");

CREATE TABLE "cafeteria_juttatas_elemek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "kod" TEXT,
    "maxDb" INTEGER,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cafeteria_juttatas_elemek_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "cafeteria_juttatas_csoportok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "cafeteria_juttatas_elemek_groupId_idx" ON "cafeteria_juttatas_elemek"("groupId");

CREATE TABLE "dolgozo_cafeteria_valasztas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "benefitItemId" TEXT NOT NULL,
    "ev" INTEGER NOT NULL,
    "darab" INTEGER NOT NULL DEFAULT 1,
    "megjegyzes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dolgozo_cafeteria_valasztas_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dolgozo_cafeteria_valasztas_benefitItemId_fkey" FOREIGN KEY ("benefitItemId") REFERENCES "cafeteria_juttatas_elemek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "dolgozo_cafeteria_valasztas_employeeId_benefitItemId_ev_key" ON "dolgozo_cafeteria_valasztas"("employeeId", "benefitItemId", "ev");
CREATE INDEX "dolgozo_cafeteria_valasztas_employeeId_idx" ON "dolgozo_cafeteria_valasztas"("employeeId");
CREATE INDEX "dolgozo_cafeteria_valasztas_ev_idx" ON "dolgozo_cafeteria_valasztas"("ev");

CREATE TABLE "allas_hirdetesek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cim" TEXT NOT NULL,
    "leiras" TEXT,
    "jobPositionId" TEXT,
    "allapot" TEXT NOT NULL DEFAULT 'PISZKOZAT',
    "publikalva" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "allas_hirdetesek_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "munkakorok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "allas_hirdetesek_allapot_idx" ON "allas_hirdetesek"("allapot");
CREATE INDEX "allas_hirdetesek_jobPositionId_idx" ON "allas_hirdetesek"("jobPositionId");

CREATE TABLE "palyazatok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postingId" TEXT NOT NULL,
    "jelentkezoNev" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "allapot" TEXT NOT NULL DEFAULT 'BEERKEZETT',
    "megjegyzes" TEXT,
    "cvFajlUtvonal" TEXT,
    "cvFajlNev" TEXT,
    "cvDocumentId" TEXT,
    "hiredEmployeeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "palyazatok_postingId_fkey" FOREIGN KEY ("postingId") REFERENCES "allas_hirdetesek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "palyazatok_cvDocumentId_fkey" FOREIGN KEY ("cvDocumentId") REFERENCES "dokumentumok" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "palyazatok_hiredEmployeeId_fkey" FOREIGN KEY ("hiredEmployeeId") REFERENCES "dolgozok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "palyazatok_cvDocumentId_key" ON "palyazatok"("cvDocumentId");
CREATE INDEX "palyazatok_postingId_idx" ON "palyazatok"("postingId");
CREATE INDEX "palyazatok_allapot_idx" ON "palyazatok"("allapot");
CREATE INDEX "palyazatok_hiredEmployeeId_idx" ON "palyazatok"("hiredEmployeeId");

CREATE TABLE "munkaido_import_batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fajlNev" TEXT NOT NULL,
    "sikeres" BOOLEAN NOT NULL DEFAULT false,
    "hibaUzenet" TEXT,
    "rekordok" INTEGER,
    "letrehozva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "munkaido_bejegyzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "datum" DATETIME NOT NULL,
    "ora" REAL NOT NULL,
    "tipus" TEXT NOT NULL DEFAULT 'NORMAL',
    "megjegyzes" TEXT,
    "forras" TEXT NOT NULL DEFAULT 'KEZI',
    "importBatchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "munkaido_bejegyzes_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "munkaido_bejegyzes_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "munkaido_import_batch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "munkaido_bejegyzes_employeeId_idx" ON "munkaido_bejegyzes"("employeeId");
CREATE INDEX "munkaido_bejegyzes_datum_idx" ON "munkaido_bejegyzes"("datum");
CREATE INDEX "munkaido_bejegyzes_importBatchId_idx" ON "munkaido_bejegyzes"("importBatchId");

CREATE TABLE "tavollet_kerelmek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "tipus" TEXT NOT NULL,
    "kezdet" DATETIME NOT NULL,
    "veg" DATETIME NOT NULL,
    "allapot" TEXT NOT NULL DEFAULT 'FOLYAMATBAN',
    "indoklas" TEXT,
    "workflowInstanceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tavollet_kerelmek_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tavollet_kerelmek_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_peldanyok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "tavollet_kerelmek_employeeId_idx" ON "tavollet_kerelmek"("employeeId");
CREATE INDEX "tavollet_kerelmek_kezdet_veg_idx" ON "tavollet_kerelmek"("kezdet", "veg");
CREATE INDEX "tavollet_kerelmek_allapot_idx" ON "tavollet_kerelmek"("allapot");
CREATE INDEX "tavollet_kerelmek_workflowInstanceId_idx" ON "tavollet_kerelmek"("workflowInstanceId");

CREATE TABLE "tavollet_jovahagyasok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leaveRequestId" TEXT NOT NULL,
    "sorrend" INTEGER NOT NULL,
    "approverUserId" TEXT,
    "allapot" TEXT NOT NULL DEFAULT 'VAR',
    "dontesDatum" DATETIME,
    "megjegyzes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tavollet_jovahagyasok_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "tavollet_kerelmek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tavollet_jovahagyasok_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "felhasznalok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "tavollet_jovahagyasok_leaveRequestId_sorrend_key" ON "tavollet_jovahagyasok"("leaveRequestId", "sorrend");
CREATE INDEX "tavollet_jovahagyasok_leaveRequestId_idx" ON "tavollet_jovahagyasok"("leaveRequestId");
CREATE INDEX "tavollet_jovahagyasok_approverUserId_idx" ON "tavollet_jovahagyasok"("approverUserId");

CREATE TABLE "dolgozo_celok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "cim" TEXT NOT NULL,
    "leiras" TEXT,
    "celErtek" TEXT,
    "suly" REAL,
    "allapot" TEXT NOT NULL DEFAULT 'TERVEZETT',
    "hatarido" DATETIME,
    "workflowInstanceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dolgozo_celok_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dolgozo_celok_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_peldanyok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "dolgozo_celok_employeeId_idx" ON "dolgozo_celok"("employeeId");
CREATE INDEX "dolgozo_celok_allapot_idx" ON "dolgozo_celok"("allapot");

CREATE TABLE "dolgozo_cel_tevekenysegek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "datum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "megjegyzes" TEXT NOT NULL,
    CONSTRAINT "dolgozo_cel_tevekenysegek_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "dolgozo_celok" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "dolgozo_cel_tevekenysegek_goalId_idx" ON "dolgozo_cel_tevekenysegek"("goalId");

CREATE TABLE "beleptetes_sablonok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nev" TEXT NOT NULL,
    "leiras" TEXT,
    "dokLista" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "beleptetes_peldanyok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "allapot" TEXT NOT NULL DEFAULT 'FOLYAMATBAN',
    "workflowInstanceId" TEXT,
    "megkezdve" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "befejezve" DATETIME,
    "megjegyzes" TEXT,
    CONSTRAINT "beleptetes_peldanyok_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "dolgozok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "beleptetes_peldanyok_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "beleptetes_sablonok" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "beleptetes_peldanyok_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_peldanyok" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "beleptetes_peldanyok_employeeId_idx" ON "beleptetes_peldanyok"("employeeId");
CREATE INDEX "beleptetes_peldanyok_templateId_idx" ON "beleptetes_peldanyok"("templateId");
CREATE INDEX "beleptetes_peldanyok_allapot_idx" ON "beleptetes_peldanyok"("allapot");

CREATE INDEX "workflow_peldanyok_subjectEmployeeId_idx" ON "workflow_peldanyok"("subjectEmployeeId");
