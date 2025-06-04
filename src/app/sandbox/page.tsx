import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { files, folders } from "~/server/db/schema";

export default function page() {
  return (
    <div className="flex flex-col gap-4">
      Seed funciton
      <form
        action={async () => {
          "use server";

          // eslint-disable-next-line drizzle/enforce-delete-with-where
          await db.delete(folders);
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          await db.delete(files);

          await db.insert(folders).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: index !== 0 ? 1 : null,
            })),
          );
          await db.insert(files).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              size: 5000,
              url: file.url,
              parent: (index % 3) + 1,
            })),
          );
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
