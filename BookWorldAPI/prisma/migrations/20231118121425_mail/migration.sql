-- CreateTable
CREATE TABLE "MailTemplates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aliasName" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "dynamicVariables" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MailTemplates_id_key" ON "MailTemplates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MailTemplates_aliasName_key" ON "MailTemplates"("aliasName");
