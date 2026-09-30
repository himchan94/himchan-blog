-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "seriesId" TEXT,
ADD COLUMN     "seriesOrder" INTEGER;

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostView" (
    "postId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostView_pkey" PRIMARY KEY ("postId","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "Series_title_key" ON "Series"("title");

-- CreateIndex
CREATE INDEX "Post_categories_idx" ON "Post" USING GIN ("categories");

-- CreateIndex
CREATE UNIQUE INDEX "Post_seriesId_seriesOrder_key" ON "Post"("seriesId", "seriesOrder");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostView" ADD CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CHECK 제약은 Prisma 스키마로 표현할 수 없어 여기서만 관리한다 (docs/domain/admin.md).
-- 공개 쿼리가 publishedAt을 non-null로 가정한다.
ALTER TABLE "Post" ADD CONSTRAINT "Post_published_has_date" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);
ALTER TABLE "Project" ADD CONSTRAINT "Project_published_has_date" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

-- 시리즈에 속하면 순서도 있어야 한다.
ALTER TABLE "Post" ADD CONSTRAINT "Post_series_has_order" CHECK (("seriesId" IS NULL) = ("seriesOrder" IS NULL));
