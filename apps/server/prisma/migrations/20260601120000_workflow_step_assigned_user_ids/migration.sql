-- Több felhasználó hozzárendelése workflow lépéshez (elsődleges: assignedToId, továbbiak: assignedUserIds)
ALTER TABLE "workflow_lepesek" ADD COLUMN "assignedUserIds" TEXT;
