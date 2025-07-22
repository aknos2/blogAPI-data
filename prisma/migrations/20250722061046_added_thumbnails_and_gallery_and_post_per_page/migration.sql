/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content" TEXT,
ADD COLUMN     "thumbnailId" TEXT;

-- CreateTable
CREATE TABLE "PostPage" (
    "id" TEXT NOT NULL,
    "pageNum" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "isInGallery" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostPage_postId_pageNum_key" ON "PostPage"("postId", "pageNum");

-- CreateIndex
CREATE UNIQUE INDEX "Post_thumbnailId_key" ON "Post"("thumbnailId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "PostImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPage" ADD CONSTRAINT "PostPage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
