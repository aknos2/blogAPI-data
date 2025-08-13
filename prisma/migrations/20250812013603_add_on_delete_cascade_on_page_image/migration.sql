-- DropForeignKey
ALTER TABLE "PageImage" DROP CONSTRAINT "PageImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "PageImage" DROP CONSTRAINT "PageImage_pageId_fkey";

-- AddForeignKey
ALTER TABLE "PageImage" ADD CONSTRAINT "PageImage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "PostPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageImage" ADD CONSTRAINT "PageImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "PostImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
